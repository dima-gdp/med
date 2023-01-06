import { useDialog } from '~/components/ui-composables/useDialog'

describe('components/ui-composables/useDialog', () => {
  const FAKE_CONTEXT = {
    emit: jest.fn(),
  }

  it('useDialog взвращает состояние которое было ему передано', () => {
    const dialogData = useDialog(true, FAKE_CONTEXT)
    expect(dialogData.model).toBe(true)
  })
  it('useDialog метод close эммитит значение false', () => {
    const dialogData = useDialog(true, FAKE_CONTEXT)
    dialogData.close()
    expect(FAKE_CONTEXT.emit).toHaveBeenCalledWith('input', false)
  })
})
