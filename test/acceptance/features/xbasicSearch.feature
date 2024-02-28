Feature: Perform a basic search
    Scenario: Successfully perform a simple search
        Given I open the url "/"
        When I click on the link "Search dog index"
        And I set "rexZZZ" to the inputfield "#searchTerms"
        And I press "Enter"
        Then I expect that element "html" contains the text "No results found"
