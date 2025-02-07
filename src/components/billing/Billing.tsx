import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface CompanyInfo {
  registrationNumber: string;
  taxId: string;
  statisticalId: string;
  articleCode: string;
}

interface IndividualInfo {
  fullName: string;
  billingAddress: string;
}

const Billing: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [billingType, setBillingType] = useState<'company' | 'individual'>(
    user?.billingInfo?.type || 'company'
  );
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    registrationNumber: user?.billingInfo?.company?.registrationNumber || '',
    taxId: user?.billingInfo?.company?.taxId || '',
    statisticalId: user?.billingInfo?.company?.statisticalId || '',
    articleCode: user?.billingInfo?.company?.articleCode || '',
  });
  const [individualInfo, setIndividualInfo] = useState<IndividualInfo>({
    fullName: user?.billingInfo?.individual?.fullName || '',
    billingAddress: user?.billingInfo?.individual?.billingAddress || '',
  });

  const handleSaveBillingInfo = async () => {
    try {
      const billingInfo = {
        type: billingType,
        ...(billingType === 'company' 
          ? { company: companyInfo }
          : { individual: individualInfo }
        )
      };
      
      await updateUser({ billingInfo });
      // Vous pouvez ajouter une notification de succès ici si vous le souhaitez
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des informations de facturation:', error);
      // Vous pouvez ajouter une notification d'erreur ici si vous le souhaitez
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '0€',
      features: [
        '10 générations/mois',
        '1 marque',
        '1 membre',
        '1 calendrier',
      ],
      current: false,
    },
    {
      name: 'Starter',
      price: '29€',
      features: [
        '50 générations/mois',
        '3 marques',
        '3 membres',
        '5 calendriers',
      ],
      current: true,
    },
    {
      name: 'Pro',
      price: '99€',
      features: [
        '200 générations/mois',
        '10 marques',
        '10 membres',
        '20 calendriers',
      ],
      current: false,
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent">
        Facturation
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-panel overflow-hidden transform transition-all duration-300 hover:scale-[1.02] ${
              plan.current ? 'ring-2 ring-[#53dfb2]' : ''
            }`}
          >
            <div className="p-6">
              <h2 className="text-xl leading-6 font-medium text-white">{plan.name}</h2>
              <p className="mt-4">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent">
                  {plan.price}
                </span>
                <span className="text-base font-medium text-white/60">/mois</span>
              </p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-[#53dfb2]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`mt-8 block w-full glass-button ${
                  plan.current
                    ? 'bg-[#53dfb2]/20 text-[#53dfb2] hover:bg-[#53dfb2]/30'
                    : ''
                }`}
              >
                {plan.current ? 'Plan actuel' : 'Choisir ce plan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-8">
        <div className="glass-panel overflow-hidden">
          <div className="px-6 py-6">
            <h3 className="text-xl leading-6 font-medium text-white mb-6">
              Données de facturation
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Type de facturation
                </label>
                <select
                  className="glass-input w-full"
                  onChange={(e) => setBillingType(e.target.value as 'company' | 'individual')}
                  value={billingType}
                >
                  <option value="company">Entreprise</option>
                  <option value="individual">Particulier</option>
                </select>
              </div>

              {billingType === 'company' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      RC N°
                    </label>
                    <input
                      type="text"
                      className="glass-input w-full"
                      value={companyInfo.registrationNumber}
                      onChange={(e) => setCompanyInfo({...companyInfo, registrationNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      NIF N°
                    </label>
                    <input
                      type="text"
                      className="glass-input w-full"
                      value={companyInfo.taxId}
                      onChange={(e) => setCompanyInfo({...companyInfo, taxId: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      NIS N°
                    </label>
                    <input
                      type="text"
                      className="glass-input w-full"
                      value={companyInfo.statisticalId}
                      onChange={(e) => setCompanyInfo({...companyInfo, statisticalId: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Code Article
                    </label>
                    <input
                      type="text"
                      className="glass-input w-full"
                      value={companyInfo.articleCode}
                      onChange={(e) => setCompanyInfo({...companyInfo, articleCode: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Nom & Prénom
                    </label>
                    <input
                      type="text"
                      className="glass-input w-full"
                      value={individualInfo.fullName}
                      onChange={(e) => setIndividualInfo({...individualInfo, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Adresse de facturation
                    </label>
                    <textarea
                      className="glass-input w-full"
                      rows={3}
                      value={individualInfo.billingAddress}
                      onChange={(e) => setIndividualInfo({...individualInfo, billingAddress: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="glass-button bg-[#53dfb2]/20 text-[#53dfb2] hover:bg-[#53dfb2]/30"
                  onClick={handleSaveBillingInfo}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="px-6 py-6">
            <h3 className="text-xl leading-6 font-medium text-white">
              Historique des factures
            </h3>
            <div className="mt-6">
              <div className="flex items-center justify-between py-4 border-b border-white/10 hover:bg-white/5 transition-colors px-4">
                <div>
                  <p className="text-sm font-medium text-white">Janvier 2024</p>
                  <p className="text-sm text-white/60">Plan Starter</p>
                </div>
                <button
                  type="button"
                  className="text-[#53dfb2] hover:text-[#53dfb2]/80 text-sm font-medium transition-colors"
                >
                  Télécharger
                </button>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-white/10 hover:bg-white/5 transition-colors px-4">
                <div>
                  <p className="text-sm font-medium text-white">Décembre 2023</p>
                  <p className="text-sm text-white/60">Plan Starter</p>
                </div>
                <button
                  type="button"
                  className="text-[#53dfb2] hover:text-[#53dfb2]/80 text-sm font-medium transition-colors"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
