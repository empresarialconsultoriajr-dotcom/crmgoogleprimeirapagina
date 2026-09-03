import React from 'react'
import './styles.css'

import ProgressBar from './components/ProgressBar.jsx'
import Hero from './components/Hero.jsx'
import FeaturedProject from './components/FeaturedProject.jsx'
import Story from './components/Story.jsx'
import Universe from './components/Universe.jsx'
import Opportunities from './components/Opportunities.jsx'
import Partnerships from './components/Partnerships.jsx'
import Business from './components/Business.jsx'
import Social from './components/Social.jsx'
import Footer from './components/Footer.jsx'

import {
  featuredProject,
  activeContent,
  activeOpportunities,
  activePartnerships,
  activeSocialLinks,
} from './data/index.js'

/**
 * Arquitetura da página — a ordem é a narrativa.
 *
 *  1. Hero .............. a pessoa, antes de qualquer link.
 *  2. Além das Redes .... a ponte: você veio pelo perfil, esta é a história de antes.
 *  3. Quem sou .......... o registro claro; a história contada por ela.
 *  4. Universo .......... onde a conversa continua todos os dias.
 *  5. Oportunidades ..... o que ela abre para a comunidade.
 *  6. Indicações ........ o que ela usa e recomenda.
 *  7. Publicidade ....... a porta comercial, para marcas.
 *  8. Redes ............. o retorno ao ponto de partida.
 *
 * Toda seção é alimentada por data/ — nenhum link é escrito em JSX.
 */
export default function App() {
  return (
    <>
      <ProgressBar />
      <a className="skip-link" href="#alem-das-redes">
        Ir para o conteúdo
      </a>

      <Hero />

      <main>
        <FeaturedProject project={featuredProject} />
        <Story />
        <Universe items={activeContent} />
        <Opportunities items={activeOpportunities} />
        <Partnerships items={activePartnerships} />
        <Business />
        <Social items={activeSocialLinks} />
      </main>

      <Footer />
    </>
  )
}
