import type {Socket as SocketIO} from 'socket.io'

import { DataSource } from '../data-source'

type Socket = SocketIO & {
  canConnect: boolean,
  user: any
}

// Этот тип на самом деле должен быть классом с геттером administrator,
// а вообще текущие роли на ws не подразумевают ситуацию, когда будет роль с частичными правами администратора трансляции (либо все либо ничего)
interface DbUser {
  user_id: number | string;
  username: string;
  role: string[];
  token: string;
  administrator: boolean
}

export default (dataSource: DataSource) => {
  return async function (socket: Socket, next: Function): Promise<any> {
    const { redis, db } = dataSource

    const queryToken = socket.handshake.query?.token
    const queryRoom = socket.handshake.query?.room

    if(typeof queryToken != 'string') throw Error('Token is not string')
    if(typeof queryRoom != 'string') throw Error('QueryRoom is not string')

    const token: string = queryToken.toString()
    const room: string = queryRoom.toString()

    let user = await redis.findUserByToken(token)

    if (user === null) {
      const [userFromDb]: DbUser[] = await db.getUserByToken(token)
        .catch((e: string) => next(new Error(e)))

      if (userFromDb) {
        userFromDb.administrator = [
          'manager',
          'editor',
          'administrator',
          'moderator',
        ].some(role => userFromDb.role.includes(role))

        redis.addUser(userFromDb, token)

        user = userFromDb
      } else {
        return new Error('Пользователь не найден')
      }
    }

    // ))
    socket.user = {
      socketId: socket.id,
      ...user,
    }

    const { user_id } = user

    const client = await redis.findUserInRoom(room, token)

    // @ts-ignore
    const [viewpoint] = client !== null && client.viewpoint ? [client.viewpoint] : await db.getViewPoint(user_id, room)

    if (viewpoint) {
      // Удалить пользователя из списка приглашённых
      if (viewpoint.parent_id && !viewpoint.invite_deleted_at) {
        await db.deleteStreamInvite(viewpoint.id)
          .catch((e: string) => {
            throw new Error(e)
          })
      }

      // Всегда обновлять данные о браузере при заходе пользователя
      await db.clearViewPointEndedField(viewpoint.id)
        .catch((e: string) => {
          throw new Error(e)
        })

      await db.clearInvitedViewPointEndedFields(viewpoint.id)
        .catch((e: string) => {
          throw new Error(e)
        })
    }
    console.log(user)
    const payload = {
      ...user,
      socketId: socket.id,
      viewpoint: viewpoint || (await db.createViewPoint(+user_id, +room))[0],
      room,
    }

    await redis.addUserToRoom(payload, token)

    return next()
  }
}
