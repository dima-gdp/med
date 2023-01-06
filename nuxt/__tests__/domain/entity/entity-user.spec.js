import EntityUser from '@/domain/entities/entity-user'
import { mockUserDataFixture } from '@/api/mocs/api-user-mock'

describe('domain/entities/entity-user', () => {
  it('Конструктор выбрасывает TypeError если создавать экземпляр с пустой userData', () => {
    expect(() => new EntityUser()).toThrow(TypeError)
  })

  it('метод getPublicIdentity возвращает имя фамилию в случае если они есть', () => {
    let user = new EntityUser(mockUserDataFixture)
    const publicIdentityFull = user.getPublicIdentity()
    user = new EntityUser({
      ...mockUserDataFixture,
      profile: { ...mockUserDataFixture.profile, lastName: undefined },
    })
    const publicIdentityNoLastName = user.getPublicIdentity()
    user = new EntityUser({
      ...mockUserDataFixture,
      profile: { ...mockUserDataFixture.profile, firstName: undefined },
    })
    const publicIdentityNoFirstName = user.getPublicIdentity()

    const { firstName, lastName } = mockUserDataFixture.profile

    expect(publicIdentityFull).toBe(`${firstName} ${lastName}`)
    expect(publicIdentityNoLastName).toBe(firstName)
    expect(publicIdentityNoFirstName).toBe(lastName)
  })

  it('метод getPublicIdentity возвращает почту, если нету ни имени ни фамилии', () => {
    const user = new EntityUser({
      ...mockUserDataFixture,
      profile: { ...mockUserDataFixture.profile, firstName: undefined, lastName: undefined },
    })
    const publicIdentityNoName = user.getPublicIdentity()
    expect(publicIdentityNoName).toBe(mockUserDataFixture.email)
  })
})
