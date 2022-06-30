import Head from "next/head";

export default function Seo({ title = "Message grid" }: { title?: string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="Message grid" />
    </Head>
  );
}
