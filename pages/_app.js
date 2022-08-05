import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { SessionProvider } from 'next-auth/react'

export default function MyApp({ Component, pageProps }) {

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <SessionProvider session={pageProps.session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  )  

}