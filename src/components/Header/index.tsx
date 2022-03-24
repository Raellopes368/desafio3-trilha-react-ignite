import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div>
        <Link href="/">
          <img src="/logo.png" alt="logo" />
        </Link>
      </div>
    </header>
  );
}
