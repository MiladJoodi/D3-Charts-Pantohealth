const Info = () => {
    return (
      <section className="w-full max-w-4xl bg-blue-50 text-blue-900 p-4 rounded-xl shadow-sm border border-blue-100">
        <h1 className="text-xl font-semibold mb-1">📊 Pantohealth Chart Renderer</h1>
        <p className="text-sm">
          A simple chart visualization tool built with{' '}
          <strong>Next.js</strong> and <strong>D3.js</strong>.
          Created as part of a technical assignment for{' '}
          <a
            href="https://pantohealth.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Pantohealth
          </a>.
        </p>
        <p className="text-sm mt-2">
          Data is fetched from{' '}
          <a
            href="/data.json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            /data.json
          </a>.
        </p>
      </section>
    )
  }
  
  export default Info
  