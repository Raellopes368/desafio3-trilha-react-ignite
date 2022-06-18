import { GetStaticProps } from 'next';
import * as Prismic from '@prismicio/client';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { AiOutlineCalendar } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { formatToLocaleDate } from '../utils/formatToLocaleDate';

interface Post {
  uid: string;
  first_publication_date: string;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicate.at('document.type', 'posts'),
    {
      pageSize: 100,
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    }
  );

  const posts: Post[] = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: RichText.asText(post.data.title),
      subtitle: RichText.asText(post.data.subtitle),
      author: post.data.author,
    },
  }));

  const { next_page } = postsResponse;

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page,
      },
    },
  };
};

export default function Home({ postsPagination }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {postsPagination.results.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.info}>
                  <div>
                    <AiOutlineCalendar color="#BBBBBB" size={23} />
                    <time>{post.first_publication_date}</time>
                  </div>
                  <div>
                    <BiUser color="#BBBBBB" size={23} />
                    <time>{post.data.author}</time>
                  </div>
                </div>
              </a>
            </Link>
          ))}
          {postsPagination.next_page && (
            <span className={styles.nextButton}>Carregar mais posts</span>
          )}
        </div>
      </main>
    </>
  );
}
