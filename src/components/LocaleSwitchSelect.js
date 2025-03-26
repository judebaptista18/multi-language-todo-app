"use client";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
export default function LocaleSwitchSelect({defaultValue}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleLocaleChange = (e) => {
    router.replace({ pathname, params }, { locale: e.target.value });
  };

  return (
    <select onChange={handleLocaleChange}  defaultValue={defaultValue}>
      {routing.locales.map((cur) => (
        <option key={cur} value={cur}>
          {cur}
        </option>
      ))}
    </select>
  );
}
