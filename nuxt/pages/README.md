# Чтобы добавить роут нужно внести изменения в двух файлах:

## chart/templates/ingress.yaml

Найти что-то похожее
` - path: /action
  pathType: Prefix
  backend:
    serviceName: {{ include "med.fullname" . }}-public-service
    servicePort: {{.Values.public.port}}`

И вставить рядом свое, заменив path


## Caddyfile
В объект @public добавить свой роут по аналогии с тем, что в этом файле
