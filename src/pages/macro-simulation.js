import PopulationModel from '../components/PopulationModel'

export default function InterventionPage() {
  return (
    <main className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto">
        <h1 className="text-3xl text-gray-700 font-bold mb-6 text-center">
          Population Intervention Model
        </h1>
        <PopulationModel />
      </div>
    </main>
  )
}