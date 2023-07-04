import styles from '../styles/Valid.module.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
// ANTD LIBRAIRIE
import { Button } from 'antd';
import CountUp from 'react-countup';
import { QuestionCircleOutlined } from '@ant-design/icons';

function Valid() {

    const router = useRouter()

    const handleMenu = () => {
        router.push('/')
    }

    return (
        <div>
        <main className={styles.pageContainer}>
          <header className={styles.headerContainer}>
            <div>
              <h1 className={styles.titlePage}>Commande</h1>
            </div>
          </header>
          {/* validé la commande */}
          <div className={styles.validContainer}>
              <h4 className={styles.commandTitle}>La commande a bien été prise en charche</h4>
              <p className={styles.commandP}>Merci et à bientôt !</p>
              <Button type="primary" size='medium' style={{ width: 100}} onClick={() => handleMenu()}>
              Menu
            </Button>          
            </div>
        </main>
      </div>   
    )
}

export default Valid