module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm start',
      startServerReadyPattern: 'Server at',
      url: ['http://localhost:8080/', 'http://localhost:8080/en/'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance':    ['warn',  { minScore: 0.9 }],
        'categories:accessibility':  ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn',  { minScore: 0.9 }],
        'categories:seo':            ['warn',  { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
