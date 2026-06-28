'use client'
import { useState, useEffect } from 'react'
const CATEGORIES = ['Health','Finance','Math','Science','Construction','Food','Other']
export default function Home() {
  const [calculators, setCalculators] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [result, setResult] = useState<any>(null)
  useEffect(() => { fetch('/api/calculators').then(r=>r.json()).then(d=>setCalculators(d.calculators||[])) }, [])
  const calculate = async () => {
    const nums: Record<string, number> = {}
    Object.entries(values).forEach(([k,v]) => { nums[k] = parseFloat(v) || 0 })
    const res = await fetch('/api/calculate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ values: nums }) })
    const data = await res.json()
    setResult(data)
  }
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto flex gap-8">
        <div className="w-48 shrink-0">
          <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">OmniCalc</h1>
          {CATEGORIES.map(c => (
            <button key={c} className="block w-full text-left px-4 py-2 rounded-lg mb-2 bg-white/10 hover:bg-white/20 transition text-sm">{c}</button>
          ))}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-6">3,600+ Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {calculators.map(c => (
              <div key={c.id} onClick={() => setSelected(c.id)}
                className={`bg-white/10 backdrop-blur rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${selected === c.id ? 'ring-2 ring-purple-500' : ''}`}>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-gray-400 text-sm">{c.category}</p>
              </div>
            ))}
          </div>
          {selected && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Enter Values</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input placeholder="Value A" onChange={e => setValues({...values, a: e.target.value})}
                  className="bg-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none" />
                <input placeholder="Value B" onChange={e => setValues({...values, b: e.target.value})}
                  className="bg-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none" />
              </div>
              <button onClick={calculate} className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">Calculate</button>
              {result && (
                <div className="mt-4 bg-green-900/30 rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-400">Result: {result.result}</p>
                  <p className="text-gray-400 text-sm mt-1">Formula: {result.formula}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
