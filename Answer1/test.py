from typing import List

def filterPunctuation(message):
    punctuation = ['.',',','!','?']
    filtered = ""
    for ch in message:
        if ch not in punctuation:
           filtered += ch
    return filtered
def findMostFrequentWord(messages:List[str], stopWords:List[str]) -> str:
    wordCounts = {}
    punctuation = ['.',',','!','?']
    print(f'input: messages = {messages}')
    print(f'input: stopWord = {stopWords}')
    rawWord = []
    filtered = []
    if len(messages) < 1:
        print(f'Process: No messages')
        return ""
    for message in messages:
        lowerMessage = message.lower()
        splitMessage = lowerMessage.split(' ')
        for subMessage in splitMessage:
            rawWord.append(filterPunctuation(subMessage))
    print(f'Process: Raw words: {rawWord}')
    # filtering stop word
    for token in rawWord:
        if token not in stopWords:
            filtered.append(token)
    print(f'Process: After filtering Stop Words: {filtered}')
    
    for c in filtered:
        if c in wordCounts:
            wordCounts[c] += 1
        else:
            wordCounts[c] = 1
    if len(filtered) < 1:
        print(f"Process: Frequency Count: No words remaining.")
        return ""
    print(f'Process: Frequency Count: {wordCounts}')
    
    # finding max values in dict
    ans = max(wordCounts, key=wordCounts.get)
    return ans

if __name__ == "__main__":
    print("Output 1:"+findMostFrequentWord(["Hello world!", "Hello everyone", "The world is beautiful"],["the", "is"]))
    print("Output 2:"+findMostFrequentWord(["a b c", "a b", "a"],[]))
    print("Output 3:"+findMostFrequentWord(["hello.", "World!"],["hello", "world"]))
    print("Output 4:"+findMostFrequentWord([],["a", "b"]))
    