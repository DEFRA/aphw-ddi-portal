Feature: Update status manually

    Scenario: Search a dog
        Given I open the url "/"
        When I click on the link "Search dog index"
        And I set "Fido" to the inputfield "#searchTerms"
        And I press "Enter"
        Then I expect that element "html" contains the text "1 dog record"

    Scenario: Select a dog
        When I click on the link containing "ED30"
        Then I expect that element "h1" contains the text "Dog ED30"
        And I expect that element "(//dd)[1]" contains the text "Fido"

    Scenario: Click edit exemption details(change status from edit exemption details)
        When I click on the element "(//a[contains(text(),'Edit details')])[2]"
        Then I expect that element "h1" contains the text "Edit exemption details"
    
    Scenario: Click on change status
        When I click on the link "Change status"
        Then I expect that element "h1" contains the text "Change the status for Dog ED30"
        And I expect that element "form" contains the text "is currently Pre-exempt."
        
    Scenario: Change status
        When I select the radio option with the value "Exempt" from the radio group "newStatus"
        And I click on the element "button=Change status"
        And I click on the link containing "Go to the dog record for Dog"
        Then I expect that element "h1" contains the text "Dog ED30"
        And I expect that element "(//dd)[8]" contains the text "Exempt"

    Scenario: Change status from dog details page
        When I click on the link containing "Change status"
        And I select the radio option with the value "Pre-exempt" from the radio group "newStatus"
        And I click on the element "button=Change status"
        And I click on the link containing "Go to the dog record for Dog"
        Then I expect that element "h1" contains the text "Dog ED30"
        And I expect that element "(//dd)[8]" contains the text "Pre-exempt"




