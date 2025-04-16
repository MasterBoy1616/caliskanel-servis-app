// React frontend: Çalışkanel Bosch Car Service için göz alıcı fiyat sorgulama ekranı
import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "https://caliskanel-servis-app-1.onrender.com";



export default function FiyatSorgulama() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [parts, setParts] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({ buji: false, balata: false, disk: false });

  useEffect(() => {
    axios.get("/api/brands").then(res => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then(res => setModels(res.data));
      setSelectedModel("");
      setSelectedType("");
      setParts(null);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/types?brand=${selectedBrand}&model=${selectedModel}`).then(res => setTypes(res.data));
    }
  }, [selectedModel]);

  useEffect(() => {
    if (selectedBrand && selectedModel && selectedType) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}&type=${selectedType}`).then(res => setParts(res.data));
    }
  }, [selectedType]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = parts.baseParts.reduce((sum, p) => sum + (p.price || 0), 0);
    ["buji", "balata", "disk"].forEach(key => {
      if (selectedExtras[key]) {
        total += parts.optional[key].reduce((sum, p) => sum + (p.price || 0), 0);
      }
    });
    return total;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl max-w-4xl mx-auto p-6 border border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <img src="/logo-caliskanel.png" alt="Çalışkanel Logo" className="h-16" />
          <h1 className="text-2xl font-bold text-gray-800">Fiyat Sorgulama Sistemi</h1>
          <img src="/logo-bosch.png" alt="Bosch Logo" className="h-12" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select onChange={e => setSelectedBrand(e.target.value)} value={selectedBrand} className="border p-2 rounded">
            <option value="">Marka Seçin</option>
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>
          <select onChange={e => setSelectedModel(e.target.value)} value={selectedModel} className="border p-2 rounded">
            <option value="">Model Seçin</option>
            {models.map(m => <option key={m}>{m}</option>)}
          </select>
          <select onChange={e => setSelectedType(e.target.value)} value={selectedType} className="border p-2 rounded">
            <option value="">Tip Seçin</option>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {parts && (
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-gray-700">Periyodik Bakım Parçaları:</h2>
              <ul className="list-disc list-inside">
                {parts.baseParts.map((p, i) => (
                  <li key={i}>{p.name} - {p.price.toFixed(2)} TL</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-gray-700">Ekstra Parçalar:</h2>
              {Object.entries(parts.optional).map(([key, items]) => (
                <label key={key} className="block">
                  <input type="checkbox" className="mr-2" checked={selectedExtras[key]} onChange={e => setSelectedExtras(prev => ({ ...prev, [key]: e.target.checked }))} />
                  {items.map(i => `${i.name} - ${i.price.toFixed(2)} TL`).join(" + ")}
                </label>
              ))}
            </div>

            <div className="text-xl font-bold text-blue-600">
              Toplam Tutar: {calculateTotal().toFixed(2)} TL
            </div>

            <div className="flex gap-4 mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Teklif Al</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Randevu Al</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
