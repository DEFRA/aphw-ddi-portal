Feature: Perform a basic search

    Scenario: Dog Search(with no results)
        Given I open the url "/"
        When I click on the link "Search dog index"
        And I set "rexZZZ" to the inputfield "#searchTerms"
        And I press "Enter"
        Then I expect that element "html" contains the text "No results found"

    Scenario: Search dog record with dog name
        When I clear the inputfield "#searchTerms"
        And I set "Bravo" to the inputfield "#searchTerms"
        And I press "Enter"
        Then I expect that element "html" contains the text "1 dog record"
        And I expect that element "(//ul)" contains the text "Exempt"
        And I expect that element "(//td)[1]" contains the text "Bravo"
        And I expect that element "(//td)[2]" contains the text "Mike Turner"
        And I expect that element "(//td)[3]" contains the text "852638526311111"
        And I expect that element "(//td)[3]" contains the text "852638526322222"

    Scenario: Search dog record with microchip number
        When I clear the inputfield "#searchTerms"
        And I set "345677654355555" to the inputfield "#searchTerms"
        And I press "Enter"
        Then I expect that element "html" contains the text "1 dog record"
        And I expect that element "(//ul)" contains the text "Interim exempt"
        And I expect that element "(//td)[1]" contains the text "Dino"
        And I expect that element "(//td)[2]" contains the text "James Gunn"
        And I expect that element "(//td)[3]" contains the text "345677654355555"

    Scenario: Search dog record with microchip number2
        When I clear the inputfield "#searchTerms"
        And I set "852638526322222" to the inputfield "#searchTerms"
        And I press "Enter"
        Then I expect that element "html" contains the text "1 dog record"
        And I expect that element "(//ul)" contains the text "Exempt"
        And I expect that element "(//td)[1]" contains the text "Bravo"
        And I expect that element "(//td)[2]" contains the text "Mike Turner"
        And I expect that element "(//td)[3]" contains the text "852638526311111"
        And I expect that element "(//td)[3]" contains the text "852638526322222"

    Scenario: Search dog record with owner name
        When I clear the inputfield "#searchTerms"
        And I set "James Gunn" to the inputfield "#searchTerms"
        And I press "Enter"
        Then I expect that element "html" contains the text "2 dog records"
        And I expect that element "(//ul)[1]" contains the text "Interim exempt"
        And I expect that element "(//td)[1]" contains the text "Dino"
        And I expect that element "(//td)[2]" contains the text "James Gunn"
        And I expect that element "(//td)[3]" contains the text "345677654355555"
        And I expect that element "(//ul)[2]" contains the text "Interim exempt"
        And I expect that element "(//td)[4]" contains the text "Maxie"
        And I expect that element "(//td)[5]" contains the text "James Gunn"
        And I expect that element "(//td)[6]" contains the text "345677654366666"

    Scenario: Search dog record with owner name + dog name
        When I clear the inputfield "#searchTerms"
        And I set "James Gunn Maxie" to the inputfield "#searchTerms"
        And I press "Enter"
        Then I expect that element "html" contains the text "1 dog record"
        And I expect that element "(//ul)[1]" contains the text "Interim exempt"
        And I expect that element "(//td)[1]" contains the text "Maxie"
        And I expect that element "(//td)[2]" contains the text "James Gunn"
        And I expect that element "(//td)[3]" contains the text "345677654366666"    
