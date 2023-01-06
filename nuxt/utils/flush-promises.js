export default function flushPromises() {
  const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout
  return new Promise((resolve) => {
    scheduler(resolve)
  })
}
