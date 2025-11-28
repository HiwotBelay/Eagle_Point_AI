# text analyzer function
import re
from collections import Counter

def analyze_text(text):
    # first thing i need to do is check if the input is actually valid, if it's None or empty string or not even a string, just return empty results
    if text == None or text == "" or not isinstance(text, str):
        return {"word_count": 0, "average_word_length": 0.00, "longest_words": [], "word_frequency": {}}
    # now what i do is remove all the punctuation marks from the text using regex, then convert everything to lowercase so that "The" and "the" are counted as the same word and split it into a list
    word_list = re.sub(r'[^\w\s]', '', text).lower().split()
    if len(word_list) == 0:
        return {"word_count": 0, "average_word_length": 0.00, "longest_words": [], "word_frequency": {}}
    
    # actually let me do frequency first, then come back to average and longest words
    # count how many times each word appears in the text using Counter which makes this really easy
    word_counter = Counter(word_list)
    freq_dict = {}
    for word in word_counter:
        freq_dict[word] = word_counter[word]
    
    num_words = len(word_list)
    # now i need to calculate the average word length, what i do is add up all the lengths of all words first, then divide by the number of words
    total_letters = 0
    for i in range(len(word_list)):
        total_letters = total_letters + len(word_list[i])
    avg_len = round(total_letters / num_words, 2)
    # find the longest word(s) - there might be multiple words with the same maximum length, first i need to figure out what the maximum length is by going through all words
    max_len = 0
    for i in range(len(word_list)):
        if len(word_list[i]) > max_len:
            max_len = len(word_list[i])
    longest_words = []
    for i in range(len(word_list)):
        if len(word_list[i]) == max_len:
            longest_words.append(word_list[i])
    # problem: if the same word appears multiple times, it'll be in the list multiple times, need to remove duplicates but keep the order, can't use set() because it messes up the order
    unique_longest = []
    for i in range(len(longest_words)):
        found = False
        for j in range(len(unique_longest)):
            if unique_longest[j] == longest_words[i]:
                found = True
                break
        if not found:
            unique_longest.append(longest_words[i])
    return {"word_count": num_words, "average_word_length": avg_len, "longest_words": unique_longest, "word_frequency": freq_dict}
