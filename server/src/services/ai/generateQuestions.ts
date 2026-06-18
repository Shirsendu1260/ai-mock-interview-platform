const generateQuestions = (
    role: string,
    yoe: number,
    difficulty: string,
    qtnsCount: number
): string[] => {
    const qtnsArray = new Array(qtnsCount) // Creates an empty array of 'qtnsCount' length
                            .fill(null) // Full all positions with null, so that .map() can iterate
                            .map((_, index) => `Dummy question ${index + 1}`);
                            // Iterate over the array and each time creates string 'Dummy question ...'
                            // and modifes back to its original postion in the array

    return qtnsArray;
}

export { generateQuestions };
