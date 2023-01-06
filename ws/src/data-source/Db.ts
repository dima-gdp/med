import AppConfig from '../config'
import {Pool, PoolConfig} from 'pg'
import { RedisOptions as RedisConfig } from 'ioredis'
import { QueueManager } from './QueueManager'
import {ExtendedMessage} from './Redis'

export type DbMessage = {
  id: number,
  user_id: number,
  body: string,
  room: string,
  parent_id: number,
  for_lector: boolean,
  type: string,
  created_at: string,
  deleted: boolean,
  updated_at: string,
  material_stream_section_id: number
}

export interface ISection {
  id: number
  material_id: number
  name?: string
  started_at?: number
  ended_at?: number
}

export class Db {
  private readonly configRedis : RedisConfig
  private queueManager: QueueManager
  private pool: Pool

  constructor(config: AppConfig) {
    this.configRedis = config.redis
    this.queueManager = new QueueManager(this.configRedis, new Pool(config.db))
    this.pool = new Pool(config.db)

    this.pool.on('error', err => {
      console.error('PostgreSQL client generated error: ', err.message)
    })
  }

  private async query(sql: string, params?: any[]) {
    try {
      const client = await this.pool.connect()
      console.log(sql, '\n', params)
      const { rows } = await client.query(sql, params)
      client.release()
      return rows
    } catch (e) {
      throw new Error(e)
    }
  }

  getLectorMessages (materialId: number) {
    return this.query(`
        SELECT message.*,
               concat_ws(' ', user_profile.lastname, user_profile.firstname) as username,
               city.city,
               city.region,
               country.name as country_name,
               company.name as company_name
        FROM message
        LEFT JOIN user_profile ON message.user_id = user_profile.user_id
        LEFT JOIN company ON user_profile.company_id = company.id
        LEFT JOIN city on company.city_id = city.id
        LEFT JOIN country on company.country_id = country.country_id
        WHERE message.room = $1
          AND message.for_lector = true
          AND message.deleted = false
        ORDER BY message.updated_at
    `, [materialId])
  }

  getStreamsInfo () {
    return this.query(`
        SELECT material_stream.material_id,
               slug,
               status,
               started_at,
               title,
               count(user_id)                as total,
               count(user_id) - COUNT(ended) as online
        FROM material_stream

                 LEFT JOIN
             material m on material_id = m.id
                 LEFT JOIN
             viewpoint v on m.id = v.material_id
        WHERE date_trunc('day', material_stream.started_at) = date_trunc('day', now())
        GROUP BY material_stream.status,
                 material_stream.started_at,
                 m.title,
                 material_stream.material_id,
                 slug
    `)
  }

  getStreamData (materialId: number) {
    return this.query(`
        SELECT *
        FROM material_stream
        WHERE material_id = $1
    `, [materialId])
  }

  getUsersCounter (materialId: number | string) {
    return this.query(`
        SELECT count(user_id)                as total,
               count(user_id) - COUNT(ended) as online
        FROM viewpoint
        WHERE material_id = $1
    `, [materialId])
  }

  getUserByToken (token: string) {
    return this.query(`
      SELECT
          "user".id                                                     as user_id,
          CONCAT_WS(' ', user_profile.lastname, user_profile.firstname) as username,
          array_agg(item_name)                                          as role,
          access_token                                                  as token,
          city.city,
          city.region,
          country.name as country_name,
          company.name as company_name
      FROM
          "user"
              LEFT JOIN user_profile ON "user".id = user_profile.user_id
              RIGHT JOIN rbac_auth_assignment ON "user".id::varchar = "rbac_auth_assignment".user_id
              LEFT JOIN company ON user_profile.company_id = company.id
              LEFT JOIN city on company.city_id = city.id
              LEFT JOIN country on company.country_id = country.country_id
      WHERE
              "user".access_token = $1
      GROUP BY
          username, token, "user".id, city.city, city.region, country_name, company_name
    `, [token])
  }

  getViewPoint (userId: number, materialId: string) {
    return this.query(`
        SELECT *
        FROM viewpoint
        WHERE user_id = $1
          AND material_id = $2
    `, [userId, materialId])
  }

  clearViewPointEndedField (id: number) {
    return this.query(`
        UPDATE
            viewpoint
        SET ended = NULL
        WHERE id = $1
        RETURNING *
    `, [id])
  }

  clearInvitedViewPointEndedFields (parentId: number) {
    return this.query(`
        UPDATE
            viewpoint
        SET ended = NULL
        WHERE parent_id = $1
          AND invite_deleted_at IS NULL
    `, [parentId])
  }

  deleteStreamInvite (id: number) {
    return this.query(`
        UPDATE
            viewpoint
        SET invite_deleted_at = NOW()
        WHERE id = $1
    `, [id])
  }

  updateViewPointUserAgent (id: number, userAgent: string) {
    return this.query(`
        UPDATE
            viewpoint
        SET user_agent = $2
        WHERE id = $1
    `, [id, userAgent])
  }

  createViewPoint (userId: number | string, materialId: number | string, userAgent?: string) {
    return this.query(`
        INSERT INTO viewpoint(user_id, material_id, user_agent, started)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
    `, [userId, materialId, userId])
  }

  createMessage (
    userId: number,
    body: any,
    parent: any,
    type: string,
    viewpoint: any,
    room: string,
    sectionId: number,
  ): Promise<DbMessage[]> {
    return this.query(`
        INSERT INTO message(user_id, body, parent_id, type, viewpoint_id, room, created_at, material_stream_section_id)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
        RETURNING *
    `, [userId, body, parent, type, viewpoint, room, sectionId])
  }

  async getMessages (room: string, offset: number = 0, limit: number | null = 20) {
    const messages = await this.query(`
        SELECT
          message.*,
          array_agg(item_name)                                            as role,
          concat_ws(' ', user_profile.lastname, user_profile.firstname)   as username
        FROM
          message
          LEFT JOIN user_profile ON message.user_id = user_profile.user_id
          RIGHT JOIN rbac_auth_assignment ON user_profile.user_id::varchar = "rbac_auth_assignment".user_id
        WHERE
          message.type = 'stream/chat'
          AND message.room = $1
          AND message.deleted = false
        GROUP BY
          username, message.user_id, message.id
        ORDER BY
          message.id DESC
        OFFSET $2 LIMIT $3
    `, [room, offset, limit])

    const [{ count }] = await this.query(
      `
        SELECT COUNT( DISTINCT id )
        FROM message
        WHERE message.type = 'stream/chat'
          AND message.room = $1
          AND message.deleted = false
      `, [room])

    return {
      messages: messages.reverse(),
      total: +count,
    }
  }

  viewPointEnded (id: number) {
    return this.query(`
        UPDATE
            viewpoint
        SET ended = NOW()
        WHERE id = $1
    `, [id])
  }

  endInvitedViewpoints (parentId: number) {
    return this.query(`
        UPDATE
            viewpoint
        SET ended = NOW()
        WHERE parent_id = $1
          AND invite_deleted_at IS NULL
    `, [parentId])
  }

  updateStreamStatusAndGetTime (status: number, materialId: number, timeFieldToUpdate: string) {
    return this.query(`
        WITH update_material AS (UPDATE material SET updated_at = NOW() WHERE id = $2 RETURNING 1)
        UPDATE material_stream
        SET (status, ${timeFieldToUpdate}) = ($1, NOW())
        WHERE material_id = $2
        RETURNING ${timeFieldToUpdate}
    `, [status, materialId])
  }

  deleteMessage (id: number | string) {
    return this.query(`
        UPDATE
            message
        SET deleted = true
        WHERE id = $1
    `, [id])
  }

  getMessage (id: string | number): Promise<ExtendedMessage[]> {
    return this.query(`
    SELECT message.*,
       CONCAT_WS(' ', user_profile.lastname, user_profile.firstname) as username,
       item_name                                                     as role,
       city.city,
       city.region,
       country.name as country_name,
       company.name as company_name
    FROM message
        LEFT JOIN user_profile ON message.user_id = user_profile.user_id
        RIGHT JOIN rbac_auth_assignment ON user_profile.user_id::varchar = "rbac_auth_assignment".user_id
        LEFT JOIN company ON user_profile.company_id = company.id
        LEFT JOIN city on company.city_id = city.id
        LEFT JOIN country on company.country_id = country.country_id
    WHERE message.id = $1
      AND deleted = false
    ORDER BY message.id, rbac_auth_assignment.item_name
    `, [id])
  }

  sendLector (id: number) {
    return this.query(`
        UPDATE
            message
        SET
          (for_lector, updated_at) = (true, NOW())
        WHERE id = $1
    `, [id])
  }

  cancelLector (id: number) {
    return this.query(`
        UPDATE
            message
        SET (for_lector, updated_at) = (false, NOW())
        WHERE id = $1
    `, [id])
  }

  createNmoControl (nmoMaterialId: number) {
    return this.query(`
        INSERT INTO nmo_control(nmo_material_id)
        VALUES ($1)
        RETURNING *
    `, [nmoMaterialId])
  }

  getNmoControls (nmoMaterialId: number) {
    return this.query(`
        SELECT *
        FROM nmo_control
        WHERE nmo_material_id = $1
    `, [nmoMaterialId])
  }

  getStreamVotingData (id: number | string) {
    return this.query(`
        SELECT *,
               (
                  SELECT json_agg(oo) as options
                  FROM (SELECT *
                  FROM material_stream_poll_options AS o
                  WHERE o.poll_id = $1
                  ORDER BY id) as oo
              )
        FROM material_stream_poll AS m
        WHERE m.id = $1
      `, [id])
  }

  getStreamVotingResults (id: number | string) {
    return this.query(
      `
        SELECT *
        FROM material_stream_poll_results
        WHERE poll_id = $1
      `, [id],
    )
  }

  startVote (id: number) {
    return this.query(`
        UPDATE
            material_stream_poll
        SET status     = 2,
            started_at = $2
        WHERE id = $1
        RETURNING *
    `, [id, Math.floor(Date.now() / 1000)])
  }

  restartVote (id: number) {
    return this.query(`
        UPDATE
            material_stream_poll
        SET status = 2,
            started_at = $2
        WHERE id = $1
    `, [id, Math.floor(Date.now() / 1000)])
  }

  endVote (id: number) {
    return this.query(`
        UPDATE
            material_stream_poll
        SET status = 3,
            ended_at = $2
        WHERE id = $1
    `, [id, Math.floor(Date.now() / 1000)])
  }

  makeVote (data: any, user: any) {
    return new Promise((resolve, reject) => {
      const { poll, option, user_id } = data
      const opts = { attempts: 5, removeOnComplete: true }

      try {
        this.queueManager.insertDb.add({
          query: 'INSERT INTO material_stream_poll_results (poll_id, option_id, user_id, created_at) VALUES ($1,$2,$3,NOW())',
          params: [poll, option, user_id],
        }, opts)

        this.queueManager.insertDb.add({
          query: 'UPDATE material_stream_poll_options SET voted = voted + 1 WHERE id = $1',
          params: [option],
        }, opts)

        this.queueManager.insertDb.add({
          query: 'UPDATE material_stream_poll SET voted = voted + 1 WHERE id = $1',
          params: [poll],
        }, opts)

        resolve(null)
      } catch (e) {
        reject(e)
      }
    })
  }

  async getLastSection (room: string) {
    const [section] = await this.query(`
      SELECT
          *
      FROM
          material_stream_section
      WHERE
          material_id = $1
      ORDER BY
          started_at DESC
      LIMIT 1
    `, [room])
    if (!section) {
      throw new Error('Не найдена первая секция!')
    }
    return section as ISection
  }

  async updateSectionStartTime (sectionId: number, time: number) {
    const [updatedSection] = await this.query(`
        UPDATE
            material_stream_section
        SET
            started_at = $2
        WHERE
            id = $1
        RETURNING *
    `, [sectionId, time])
    return updatedSection as ISection
  }

  async updateSectionEndTime (sectionId: number, time: number) {
    const [updatedSection] = await this.query(`
        UPDATE
            material_stream_section
        SET
            ended_at = $2
        WHERE
            id = $1
        RETURNING *
    `, [sectionId, time])
    return updatedSection as ISection
  }

  async updateStartedAtAndReturnFirstSection (room: string) {
    const now = Math.round(Date.now() / 1000)
    const [section] = await this.query(`
        with last_section as (
          SELECT id as section_id
          FROM material_stream_section
          WHERE material_id = $1
          ORDER BY started_at
          LIMIT 1
        )
        UPDATE material_stream_section
        SET started_at = $2
        FROM last_section
        WHERE id = last_section.section_id
        RETURNING id, material_id, name, started_at, ended_at
    `, [room, now])
    return section as ISection
  }
}
