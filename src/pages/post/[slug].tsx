import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>{post.data.title} Blognite</Head>
      <h1>Post</h1>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  // const prismic = getPrismicClient();
  // const response = await prismic.getByUID(TODO);
  // // TODO
  return {
    props: {
      post: {
        first_publication_date: '',
        data: {
          title: '',
          banner: {
            url: '',
          },
          author: '',
          content: {
            heading: '',
            body: {
              text: '',
            },
          },
        },
      },
      revalidate: 60 * 30, // 30 minutes
    },
  };
};
