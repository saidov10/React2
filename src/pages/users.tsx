import { useTranslation } from 'react-i18next'

export default function Users() {
  const { t } = useTranslation()
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-extrabold tracking-tight">{t('pages.users.title')}</h1>
      <p className="text-muted-foreground max-w-md">
        {t('pages.users.description')}
      </p>
    </div>
  )
}
