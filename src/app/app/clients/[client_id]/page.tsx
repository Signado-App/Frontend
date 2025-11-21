function ClientPage({ params }: { params: { client_id: string } }) {
    return (<>Client with ID: {params.client_id}</>);
}

export default ClientPage;