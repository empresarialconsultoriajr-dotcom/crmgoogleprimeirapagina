import { Header } from '@/components/Header'
import { StickyCta } from '@/components/StickyCta'
import { Hero } from '@/sections/Hero'
import { ActionBar } from '@/sections/ActionBar'
import { Manifesto } from '@/sections/Manifesto'
import { Paths } from '@/sections/Paths'
import { Concierge } from '@/sections/Concierge'
import { Process } from '@/sections/Process'
import { Differentials } from '@/sections/Differentials'
import { Trust } from '@/sections/Trust'
import { Location } from '@/sections/Location'
import { InstagramSection } from '@/sections/InstagramSection'
import { FinalCta } from '@/sections/FinalCta'
import { Footer } from '@/sections/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ActionBar />
        <Manifesto />
        <Paths />
        <Concierge />
        <Process />
        <Differentials />
        <Trust />
        <Location />
        <InstagramSection />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  )
}
