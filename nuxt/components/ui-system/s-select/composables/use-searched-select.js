export default function useSearchedSelect(label) {
  const highlightSearchedText = (option, search) => {
    const searchedLabel = option[label.value]
    if (search) {
      const match = searchedLabel.match(new RegExp(search, 'i'))[0]
      return searchedLabel.replace(new RegExp(search, 'i'), `<span>${match}</span>`)
    } else {
      return searchedLabel
    }
  }
  return {
    highlightSearchedText,
  }
}
