export const reportKeywordsPrompt = (facts: string[] = []) => `
<prompt_objective>
Extract search keywords from the provided text using facts specified in a 'facts' block.
</prompt_objective>

<prompt_rules>
- Extract keywords from the provided text.
- Extract keywords from the facts in the 'facts' block.
- Merge keywords found in the provided text with keywords found in the facts.
- Prefer single-word keywords
- ALWAYS treat content like: proper names, company names, dates, time etc. as single keyword.
- Return all keywords in their nominative case.
- Avoid repeating keywords unless contextually justified.
- Do not make assumptions beyond the provided text and facts.
- Maintain the context of the keywords to ensure they are meaningful and not out of context.
- Ensure the accurate extraction of keywords as per the provided text and facts.
- Handle multiple facts separated by a blank line.
- Be detailed and comprehensive.
- ALWAYS include all keywords found in the provided text
- ALWAYS include all keywords found in the facts for each keyword found in the provided text
- Output should be in JSON format containing '_thoughts' and 'keywords'.
</prompt_rules>

<prompt_examples>
FACTS: The Eiffel Tower is one of the most recognizable structures in the world. It is located in Paris, France.

The Eiffel Tower is a wrought-iron lattice tower.
USER: 
The Eiffel Tower was constructed in 1889 as the entrance arch for the 1889 World's Fair.
AI: 
{
  "_thoughts": "Extracted keywords related to the Eiffel Tower based on the provided text and facts, ensuring relevancy and avoiding redundancy.",
  "keywords": ["Eiffel Tower", "1889", "entrance", "arch", "World's Fair", "Paris", "France", "recognizable", "structure", "wrought-iron", "lattice"]
}


FACTS: Morze Bałtyckie jest jednym z najmniejszych mórz na świecie. Jest położone w Europie Północnej.

Morze Bałtyckie ma powierzchnię około 377 tysięcy kilometrów kwadratowych i jest otoczone przez dziewięć państw.
USER: 
Morze Bałtyckie ma liczne zatoki, z których największa to Zatoka Botnicka.
AI: 
{
  "_thoughts": "Extracted keywords related to the Baltic Sea based on the provided text and facts, ensuring relevancy and avoiding redundancy.",
  "keywords": ["Morze Bałtyckie", "najmniejsze", "morze", "świat", "Europa", "Północna", "powierzchnia", "kilometr", "kwadratowy", "państwo", "zatoka", "Zatoka Botnicka"]
}
</prompt_examples>

<facts>
${facts.join('\n')}
</facts>

The AI should now be ready to extract search keywords from any provided text and related facts, following the specified rules and outputting in the defined JSON format.
`;
