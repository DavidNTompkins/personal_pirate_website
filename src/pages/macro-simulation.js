import PopulationModel from '../components/PopulationModel'
import Head from 'next/head'
import Link from 'next/link'

export default function InterventionPage() {
  return (
    <>
      <Head>
        <title>Population Intervention Model</title>
        <meta name="description" content="Dynamic Modeling of Interventions" />
      </Head>
      
      <main className="min-h-screen py-8 bg-sky-200">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
            >
              <img src="/favicon.ico" alt="Home" className="w-4 h-4 mr-2" /> Back to Home
              </Link>
          </div>
          
          <h1 className="text-3xl text-gray-700 font-bold mb-6 text-center">
            Population Intervention Model
          </h1>
          <PopulationModel />
        </div>
      </main>
    </>
  )
}