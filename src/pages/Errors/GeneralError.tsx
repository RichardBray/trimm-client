function GeneralError(props: {error?: unknown}) {
    console.error(props.error ?? 'no error message found');

    return (
        <>
            <h1>Looks like something has gone wrong</h1>
            <p>Please try to use the service again in a few minutes</p>
        </>
    )
}

export default GeneralError;