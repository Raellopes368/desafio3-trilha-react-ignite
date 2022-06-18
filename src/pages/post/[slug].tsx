/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { format } from 'date-fns';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import { RichText } from 'prismic-dom';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: string;
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post, ...rest }: PostProps) {
  const router = useRouter();

  if (router.isFallback) return <p>Carregando...</p>;

  const timeEstimated = post.data.content.reduce(
    (contentSum, content) => {
      const wordsHeading = content.heading
        .split(' ')
        .filter(word => word.match(/\w{1,}/i)).length;
      const wordsBody = RichText.asText(content.body)
        .split(' ')
        .filter(word => word.match(/\w{1,}/i)).length;
      const totalWords = wordsHeading + wordsBody;
      return { ...contentSum, totalWords: contentSum.totalWords + totalWords };
    },
    {
      totalWords: 0,
    }
  );

  return (
    <>
      <Head>
        <title>{post.data.title} Blognite</title>
      </Head>
      <img
        className={styles.banner}
        src={post.data.banner.url}
        alt={`Banner do conteúdo ${post.data.title}`}
      />

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={styles.info}>
            <div>
              <AiOutlineCalendar color="#BBBBBB" size={23} />
              <time>
                {format(new Date(post.first_publication_date), 'dd MMM yyyy')
                  .toString()
                  .toLowerCase()}
              </time>
            </div>
            <div>
              <BiUser color="#BBBBBB" size={23} />
              <span>{post.data.author}</span>
            </div>

            <div>
              <AiOutlineClockCircle color="#BBBBBB" size={23} />
              <span>{Math.ceil(timeEstimated.totalWords / 200)} min</span>
            </div>
          </div>
          {post.data.content.map(content => (
            <Fragment key={content.heading}>
              <h2>{content.heading}</h2>
              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </Fragment>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          slug: 'como-utilizar-hooks',
        },
      },
      {
        params: {
          slug: 'criando-um-app-cra-do-zero',
        },
      },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const slug = context.params?.slug;
  const response = await prismic.getByUID('posts', slug as string, {});

  return {
    props: {
      post: {
        uid: response.uid,
        first_publication_date: response.first_publication_date,
        data: {
          title:
            typeof response.data.title === 'string'
              ? response.data.title
              : RichText.asText(response.data.title),
          subtitle:
            typeof response.data.subtitle === 'string'
              ? response.data.subtitle
              : RichText.asText(response.data.subtitle),
          banner: {
            url: response.data.banner.url,
          },
          author: response.data.author,
          content: response.data.content?.map(content => ({
            heading:
              typeof content.heading === 'string'
                ? content.heading
                : RichText.asText(content.heading),
            body: content.body,
          })),
        },
      },
    },
    revalidate: 60 * 30, // 30
  };
};
