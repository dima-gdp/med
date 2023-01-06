import {Db, ISection} from '../../../data-source/Db'
import {Redis} from '../../../data-source/Redis'

/**
 * Класс содержит в себе методы для реализации бизнес-логики секций (пока не все)
 */
export abstract class Section {
  /**
   * Достает из редиса текущую секцию.
   * Если ее нет, то создает ее через Section.saveCurrentSection
   */
  static async getCurrentSection (db: Db, redis: Redis, room: string) {
    let currentSection = await redis.getActiveSection(room)
    if (!currentSection) {
      currentSection = await this.saveCurrentSection(db, redis, room)
    }
    return currentSection as ISection
  }

  static async saveCurrentSection (db: Db, redis: Redis, room: string) {
    const firstSection = await db.getLastSection(room)
    await redis.saveActiveSection(room, firstSection)
    return firstSection
  }
}
