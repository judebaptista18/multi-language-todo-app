import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import AuthButton from "@/components/AuthButton";
import Providers from "@/Provider";
import "../globals.css";

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body>
        <Providers>
          <NextIntlClientProvider>
            <AuthButton />
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
