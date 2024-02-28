Feature: Create new CDO

    Scenario: Enter owner details
        Given I open the url "/"
        When I click on the link "Create new record"
        And I set "John" to the inputfield "#firstName"
        And I set "Smith" to the inputfield "#lastName"
        And I set "LS20 8DA" to the inputfield "#postcode"
        And I set "12" to the inputfield "#houseNumber"
        And I click on the element "button=Find address"
        Then I expect that element "form" contains the text "12 INGS LANE"

    Scenario: Confirm address
        And I click on the element "button=Confirm address"
        Then I expect that container "h1" contains the text "Add dog details"

    Scenario: Enter dog details
        When I select the radio option with the value "XL Bully" from the radio group "breed"
        And I set "Fido" to the inputfield "#name"
        When I select the radio option with the value "cdo" from the radio group "applicationType"
        And I set "01" to the inputfield "#cdoIssued-day"
        And I set "02" to the inputfield "#cdoIssued-month"
        And I set "2024" to the inputfield "#cdoIssued-year"
        And I click on the element "button=Add dog details"
        Then I expect that element "h1" contains the text "Confirm dog details"
        And I expect that element "(//dd)[1]" contains the text "XL Bully"
        And I expect that element "(//dd)[2]" contains the text "Fido"
        And I expect that element "(//dd)[3]" contains the text "01 February 2024"
        And I expect that element "(//dd)[4]" contains the text "01 April 2024"

    Scenario: Confirm dog details
        And I click on the element "button=Confirm details"
        Then I expect that element "h1" contains the text "Enter police and court details"
