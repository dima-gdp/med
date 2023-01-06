export const livechatWidget = {
  hid: 'livechatv2',
  src: 'https://livechatv2.chat2desk.com/packs/ie-11-support.js',
  defer: true,
  callback: () => {
    window.chat24_token = 'fa86c3d822ed3714c3fb7335d73622a0'
    window.chat24_url = 'https://livechatv2.chat2desk.com'
    window.chat24_socket_url = 'wss://livechatv2.chat2desk.com/widget_ws_new'
    window.chat24_show_new_wysiwyg = 'true'
    window.chat24_static_files_domain = 'https://storage.chat2desk.com/'
    window.lang = 'ru'
    window
      .fetch(
        ''.concat(window.chat24_url, '/packs/manifest.json?nocache=').concat(new Date().getTime()),
      )
      .then(function (res) {
        return res.json()
      })
      .then(function (data) {
        const chat24 = document.createElement('script')
        chat24.type = 'text/javascript'
        chat24.async = true
        chat24.src = ''.concat(window.chat24_url).concat(data['application.js'])
        document.body.appendChild(chat24)
      })
  },
}
