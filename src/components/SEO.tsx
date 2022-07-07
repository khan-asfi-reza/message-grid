import Head from "next/head";

/**
 * SEO Header
 * @param title SEO Title
 * @component
 */
export default function Seo({ title = "Message grid" }: { title?: string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="Message grid" />
    </Head>
  );
}
