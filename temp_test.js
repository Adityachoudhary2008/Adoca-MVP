const url = 'https://script.google.com/macros/s/AKfycbwhZ-FiZzUb524L63z1LqN_vcaZ6ZkeRJNjM3Iuxmp5i9b5mpQXz88yBigNFc28g2Y/exec';

const data = {
    name: 'Final Diagnostic POST',
    phone: '9999999999',
    category: 'Verification Final',
    msg: 'Testing POST from Node.js with final permissions'
};

async function testPost() {
    console.log("Testing POST URL:", url);
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Full Response Snippet:", text.substring(0, 2000));
    } catch (err) {
        console.error("Error:", err);
    }
}

testPost();
