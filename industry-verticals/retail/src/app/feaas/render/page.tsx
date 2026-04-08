import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import BYOC from 'src/byoc';
import * as FEAAS from '@sitecore-feaas/clientside/react';

type Props = {
  searchParams: Promise<{ feaasSrc?: string | string[] }>;
};

export default async function FEAASRenderPage({ searchParams }: Props) {
  const draft = await draftMode();
  if (!draft.isEnabled) {
    notFound();
  }

  const sp = await searchParams;
  const feaasSrcRaw = sp.feaasSrc;
  const feaasSrc = Array.isArray(feaasSrcRaw) ? feaasSrcRaw[0] : feaasSrcRaw;

  return (
    <>
      {feaasSrc ? <FEAAS.Component src={feaasSrc} /> : null}
      <BYOC />
    </>
  );
}
