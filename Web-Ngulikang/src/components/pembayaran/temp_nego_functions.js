const handleSubmitNego = async () => {
    if (!negoAmount || !roomId) return;

    let numericAmount = parseInt(negoAmount.replace(/\./g, ''));
    if (isNaN(numericAmount)) return;

    if (numericAmount < 1000) {
        numericAmount = numericAmount * 1000000;
    }

    const negoText = `Saya mengajukan penawaran baru sebesar Rp ${numericAmount.toLocaleString('id-ID')}`;

    try {
        await api.post(`/negotiation/messages/${roomId}`, { content: negoText });
        setCurrentTotal(numericAmount);
        setNegoAmount("");
    } catch (error) {
        console.error("Failed to send nego", error);
    }
};

const handleNegoChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue === "") {
        setNegoAmount("");
        return;
    }
    const formattedValue = new Intl.NumberFormat('id-ID').format(rawValue);
    setNegoAmount(formattedValue);
};
