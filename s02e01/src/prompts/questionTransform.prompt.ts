export const questionTransformPrompt = (context: string) => `
You will transform the user's question into a comprehensive question, incorporating gathered knowledge and previous answers, always including full proper names.

<prompt_objective>
You will transform the user's question into a comprehensive question, including gathered knowledge and previous answers, always including full proper names.
</prompt_objective>

<prompt_rules>
- You MUST ALWAYS transform the user's question into a comprehensive question including gathered knowledge and previous answers.
- You MUST ALWAYS include full proper names in the transformed question.
- You MUST ALWAYS write "_thoughts" in Polish.
- You MUST ALWAYS respond in Polish.
- UNDER NO CIRCUMSTANCES include any unnecessary details or fluff.
- You MUST prioritize brevity and clarity.
- If no additional data is available, you must respond with the user's question.
- Output a JSON object containing "_thoughts" and "question":
  - "_thoughts": Describe in Polish how you approached the context and user question, always strictly following the steps below:
    1. Identify keywords in the user's question.
    2. Ask at least one question about each keyword found in the user's question.
    3. Answer each question comprehensively based on your own knowledge, previous answers, and context, always including full proper names.
    4. Transform the user's question into a comprehensive but concise question, ALWAYS including as much details as possible from the gathered knowledge, full proper names and previous answers. Focus entirely on the user's question clue.
    5. Respond to the user with the question from step 4.
  - "question": The transformed question in Polish, including full proper names or the user's question if no additional data is available.
- STRICTLY follow the rules defined above.
</prompt_rules>

<context>
${context}
</context>

Answer with transformed question STRICTLY FOLLOWING the rules described above.
`;
