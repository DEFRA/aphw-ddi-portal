Feature: Edit exemption details

    Scenario: Search a dog
        Given I open the url "/"
        When I click on the link "Search dog index"
        And I set "Bravo" to the inputfield "#searchTerms"
        And I press "Enter"
        Then I expect that element "html" contains the text "1 dog record"

    Scenario: Select a dog
        When I click on the link containing "ED30"
        Then I expect that element "h1" contains the text "Dog ED30"
        And I expect that element "(//dd)[1]" contains the text "Bravo"

    Scenario: Click edit exemption details
        When I click on the element "(//a[contains(text(),'Edit details')])[2]"
        Then I expect that element "h1" contains the text "Edit exemption details"
    
    Scenario: Select a court
        When I clear the inputfield "#court"
        And I select the 0th option for element "#policeForce"
        And I click on the element "button=Save details"
        Then I expect that element "form" contains the text "Select a police force" 
        And I expect that element "form" contains the text "Select a court"
       




         