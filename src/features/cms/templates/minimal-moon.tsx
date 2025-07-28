"use client";

import { Dancing_Script, Old_Standard_TT } from 'next/font/google';
import { twMerge } from 'tailwind-merge';

import { BlockRenderer } from '@/features/cms/components';

import { Block } from '../context/BlocksContext';
import pageStyles from './minimal-moon.module.css';

type Props = {
  blocks: Block[];
};

const oldStandard = Old_Standard_TT({
  subsets: ["latin"],
  weight: ["400", "700"], // ajusta los pesos según necesites
  style: ['italic', 'normal'],
  variable: "--font-old-standard",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing-script",
});

export default function MinimalMoonTemplate(props: Props) {
  return (
    <div className={twMerge("max-w-3xl mx-auto whitespace-pre-line overflow-x-hidden", `${oldStandard.variable} ${dancingScript.variable}`)}>
      <BlockRenderer pageStyles={pageStyles} blocks={props?.blocks} />
    </div>
  );
}
