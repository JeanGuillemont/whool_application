import { GainsightWrapper } from '../components/GainsightWrapper'
import NavBar from '../components/NavBar'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavBar />
      <div className="w-100 h-screen flex justify-center items-center">
        <GainsightWrapper scriptContent="" isHelmet={true}>
          <Component {...pageProps} />
        </GainsightWrapper>
      </div>
    </>
  )
}
