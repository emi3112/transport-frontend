import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
// ANTD LIBRAIRIE
import { InputNumber, Space, Select, TreeSelect, Button, Statistic, Popover } from 'antd';
import CountUp from 'react-countup';
import { QuestionCircleOutlined } from '@ant-design/icons';

function Home() {

  const router = useRouter()

  const [ names, setNames ] = useState() 
  // FETCH DES NOMS DES CLIENTS POUR ENVOIE/EXPEDITION
  useEffect(() => {
    fetch('http://localhost:3000/client').then((response) => response.json()).then(data => {
      setNames(data.names)
    })
  }, []);

  // Expéditeur
  const [expediteurValue, setExpediteurValue] = useState();
  const onChangeExpediteur = (newValue) => {
    const newValueFilter = names.filter((e) => e.value === newValue)
    console.log('expe', newValueFilter[0].label)
    setExpediteurValue(newValueFilter[0].label);
  };

  // Destinataire
  const [destinataireValue, setDestinataireValue] = useState();
  const onChangeDestinataire = (newValue) => {
    const newValueFilter = names.filter((e) => e.value === newValue)
    console.log('desti', newValueFilter[0].label)
    setDestinataireValue(newValueFilter[0].label);
  };

  // Qui paye
  const [ whoPayed, setWhoPayed ] = useState()
  const handleChangeWhoPayed = (value) => {
    console.log(`whopaid ${value}`);
    setWhoPayed(value)
  };

  // Nombre de colis
  const [ numberColis, setNumberColis ] = useState()
  const onChangeNumberColis = (value) => {
    console.log('nbColis', value);
    setNumberColis(value)
  };

  // Poids des colis
  const [ poids, setPoids ] = useState()
  const onChangePoids = (value) => {
    console.log('pois', value);
    setPoids(value)
  };



  const [ tarif, setTarif ] = useState(0)
  const [ taxe, setTaxe ] = useState(0)
  const [ total, setTotal ] = useState(0)

  // Handle fetch post new command colis
  const handleSave = () => {
    console.log('click save / post')
    if(destinataireValue && expediteurValue && whoPayed && numberColis && poids) {
      fetch('http://localhost:3000/tarifAndTaxe',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinataire: destinataireValue,
          expediteur: expediteurValue,
          whoPaid: whoPayed,
          nbColis: numberColis,
          poids: poids,
        }),
      }).then(response => response.json()).then(data => {
        if(data.result) {
          console.log(data)
          const montant = data.tarif[0].montant
          const taxe = data.taxe
          const total = montant + taxe
          setTarif(data.tarif)
          setTaxe(data.taxe)
          setTotal(total)
        }
      })
    } else {
      alert('Certaines informations sont manquantes')
    }
  }
  console.log('tarif et taxe et total', tarif, taxe, total)

  // TOTAL PART
  const formatter = (value) => <CountUp end={value} decimals={2} separator=','/>;

  // tarif / taxes / total informations !!!! à dynamiser après le fetch des informations
  const contentTarif = (
    <>
    {tarif ? 
      <div>
        <p>Tarif en fonction de :</p>
        <p>Département: {tarif[0]?.codeDepartement}</p>
        {tarif[0]?.idClientHeritage ? <p>idClientHeritage: {tarif[0].idClientHeritage}</p> : <p>idClient: {tarif[0].idClient}</p>}
        <p>Zone: {tarif[0].zone}</p>
      </div>
      :
      <div>
        <p>Vide</p>
      </div>
    }
    </>
  );

  const contentTaxe = (
    <div>
      <p>Calculé en fonction de qui paye</p>
    </div>
  );

  const contentTotal = (
    <>
    {total ?
    <div>
      <p>{tarif} + {taxe}</p>
    </div>
    :
    <div>
      <p>Vide</p>
    </div>  
  }
    </>
  );

  // Enregistrement des infos 
  const handleCommand = () => {
    router.push('/validation')
    if(destinataireValue && expediteurValue && whoPayed && numberColis && poids && tarif && taxe && total) {
      fetch('http://localhost:3000/newTransport',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinataire: destinataireValue,
          expediteur: expediteurValue,
          whoPaid: whoPayed,
          nbColis: numberColis,
          poids: poids,
          tarifHT : tarif[0].montant,
          taxe: taxe,
          total: total
        }),
      }).then(response => response.json()).then(data => {
        if(data.result) {
          setDestinataireValue(null)
          setExpediteurValue(null)
          setWhoPayed(null)
          setPoids(null)
          setNumberColis(null)
          setTarif(null)
          setTaxe(null)
          setTotal(null)
          console.log(data)
        }
      })
    } else {
      alert('Certaines informations sont manquantes')
    }
  }

  return (
    <div>
      <main className={styles.pageContainer}>
        <header className={styles.headerContainer}>
          <div>
            <h1 className={styles.titlePage}>Choisis ton envoie</h1>
          </div>

        </header>
        {/* enregistrement des informations */}
        <div className={styles.saveContainer}>
          <div className={styles.saveTitleContainer}>
            <h4 className={styles.saveTitle}>Entrer les informations de la livraison</h4>
          </div>
            <div className={styles.expedition}>
              <p className={styles.p}>Séléctionner un expéditeur</p>
              <Select
                showSearch
                style={{
                  width: '100%',
                }}
                value={expediteurValue}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                }}
                placeholder="Expéditeur"
                // allowClear
                // treeDefaultExpandAll
                onChange={onChangeExpediteur}
                options={names}
                />
            </div>
            <div className={styles.destinataire}>
              <p className={styles.p}>Séléctionner un destinataire</p>
              <Select
                showSearch
                style={{
                  width: '100%',
                }}
                value={destinataireValue}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                }}
                placeholder="Destinataire"
                // allowClear
                // treeDefaultExpandAll
                onChange={onChangeDestinataire}
                options={names}
                />
            </div>
            <div className={styles.whopayed}>
              <p className={styles.p}>Séléctionner la personne en charge des frais</p>
              <Select
                defaultValue="Frais"
                style={{
                  width: '100%',
                }}
                onChange={handleChangeWhoPayed}
                options={[
                  {
                    value: 'expediteur',
                    label: 'Expediteur',
                  },
                  {
                    value: 'destinataire',
                    label: 'Destinataire',
                  },
                ]}
              />
            </div>
            <div className={styles.numberContainer}>
              <div className={styles.poids}>
                <p className={styles.p}>Séléctionner le nombre de colis</p>
                  <InputNumber
                    defaultValue={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={onChangeNumberColis}
                    style={{ width: '95%' }}
                  />
              </div>
              <div className={styles.colisNb}>
                <p className={styles.p}>Séléctionner le poids des colis</p>
                <InputNumber
                    defaultValue={0}
                    formatter={(value) => `kg ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={onChangePoids}
                    style={{ width: '95%' }}
                  />
              </div>
            </div>
            <div className={styles.suivantButton}>
              <Button type="primary" size='large' style={{ width: 200}} onClick={() => handleSave()}>
                Suivant
              </Button>
            </div>
        </div>
        {/* affichage du prix tarid et taxes */}
        <div className={styles.totalContainer}>
          <div className={styles.totalTitleContainer}>
            <h4 className={styles.totalTitle}>Total des coûts de la livraison</h4>
          </div>
          <div className={styles.tarif}>
            {/* tarif ht */}
            {/* <div className={styles.statistics}> */}
              <Statistic title="Tarif HT" value={tarif ? tarif[0].montant : 0} formatter={formatter} style={{width: '70%', marginRight: 0}}/>
            {/* </div> */}
            {/* <div className={styles.popover}> */}
              <Popover content={contentTarif} title="Calcul du tarif">
                <QuestionCircleOutlined />
              </Popover>
            {/* </div> */}
          </div>
          <div className={styles.taxes}>
            {/* taxe */}
            <Statistic title="Taxes" value={taxe ? taxe : 0} formatter={formatter} />
            <Popover content={contentTaxe} title="Calcul des taxes">
              <QuestionCircleOutlined />
            </Popover>
          </div>
          <div className={styles.total}>
            {/* total */}
            <Statistic title="TOTAL" value={total ? total : 0} formatter={formatter} />
            <Popover content={contentTotal} title="Calcul du total">
              <QuestionCircleOutlined />
            </Popover>
          </div>
          <div className={styles.suivantButton}>
            <Button type="primary" size='large' style={{ width: 200}} onClick={() => handleCommand()}>
              Commander
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
