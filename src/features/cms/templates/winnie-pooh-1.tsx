"use client";

import { Dancing_Script, Fredoka } from 'next/font/google';
import { twMerge } from 'tailwind-merge';

import { BlockRenderer } from '@/features/cms/components';

import { Block } from '../context/BlocksContext';
import pageStyles from './winnie-pooh.module.css';

type Props = {
  blocks: Block[];
};

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "700"], // ajusta los pesos según necesites
  style: ['normal'],
  variable: "--font-fredoka",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing-script",
});

export default function WinniePoohTemplate(props: Props) {
  return (
    <div className={twMerge("max-w-3xl mx-auto whitespace-pre-line overflow-x-hidden", `${fredoka.variable} ${dancingScript.variable}`)}>
      <BlockRenderer pageStyles={pageStyles} blocks={props?.blocks} />
    </div>
  );
}
