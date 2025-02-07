import React from 'react';

const Team: React.FC = () => {
  const members = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Propriétaire',
      avatar: 'JD',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Éditeur',
      avatar: 'JS',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent">
          Équipe
        </h1>
        <button
          type="button"
          className="glass-button inline-flex items-center"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Inviter un membre
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <ul className="divide-y divide-white/10">
          {members.map((member) => (
            <li key={member.email}>
              <div className="px-6 py-6 flex items-center hover:bg-white/5 transition-colors">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-14 w-14 bg-[#53dfb2]/20 backdrop-blur-sm rounded-xl flex items-center justify-center transform transition-transform hover:scale-110">
                      <span className="text-lg font-medium text-[#53dfb2]">
                        {member.avatar}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-white">
                        {member.name}
                      </div>
                      <div className="text-sm text-white/60">{member.email}</div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#53dfb2]/20 text-[#53dfb2] mt-2">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <button
                    type="button"
                    className="text-white/40 hover:text-[#53dfb2] transition-colors"
                  >
                    <span className="sr-only">Modifier</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path
                        fillRule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Section des invitations en attente */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Invitations en attente
        </h2>
        <div className="glass-panel overflow-hidden">
          <div className="px-6 py-8 text-center text-white/60">
            Aucune invitation en attente
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
