import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HelpCircle } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <HelpCircle className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {t('common.notFound')}
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        {t('common.notFoundDesc')}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95"
      >
        {t('common.backHome')}
      </Link>
    </div>
  )
}
