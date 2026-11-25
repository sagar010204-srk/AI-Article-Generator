
const webhookURL = "https://sagar-article-generator.app.n8n.cloud/webhook/generate-article";

async function generateArticle() {
    const topic = document.getElementById("topic").value.trim();
    const button = document.getElementById("generateBtn");
    const result = document.getElementById("result");
    const article = document.getElementById("article");

    if (topic === "") {
        alert("Please enter an article topic!");
        return;
    }

    button.disabled = true;
    button.innerText = "Generating Article...";
    result.style.display = "block";
    article.innerText = "Please wait, AI is writing your article...";

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ topic: topic })
        });

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const text = await response.text();

        if (!text.trim()) {
            throw new Error("No article received. Please try again.");
        }

        article.innerText = text;

    } catch (error) {
        article.innerText = "Error: " + error.message +
            "\nPlease check your internet connection or try again.";
    } finally {
        button.disabled = false;
        button.innerText = "Generate Article";
    }
}

// Copy Article
async function copyArticle() {
    const article = document.getElementById("article").innerText;

    if (!article.trim() || article.startsWith("Error:")) {
        alert("Please generate an article first!");
        return;
    }

    try {
        await navigator.clipboard.writeText(article);
        alert("Article copied successfully!");
    } catch (error) {
        alert("Unable to copy article.");
    }
}

// Download Article
function downloadArticle() {
    const article = document.getElementById("article").innerText;

    if (!article.trim() || article.startsWith("Error:")) {
        alert("Please generate an article first!");
        return;
    }

    const blob = new Blob([article], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "generated-article.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
