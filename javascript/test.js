// FORMAT: tests should follow the format "<ENTITY> should <LOGIC>"
// TEST: submitButton should disable when inputField value word count is not between 3 and 280 inclusive (disable button when invalid input)
// SUBTEST: submitButton should disable when inputField value word count is 300
// SUBTEST: submitButton should disable when inputField value word count is 0
// TEST: submitButton should disable when inputField current value and previously submitted input is similar
// TEST: clearButton should remove content inside inputField on click event
// TEST: clearButton should reset the exampleOptions to default value on click event
// TEST: wordCountDisplay should display 0 when clearButton is clicked
// TEST: submitButton should get value of inputField and on click event
// TEST: submitButton should disable submitButton during fetching output on click event