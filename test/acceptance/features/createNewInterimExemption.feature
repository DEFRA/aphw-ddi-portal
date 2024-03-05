Feature: Create new Interim exemption scheme

    Scenario: Select Interim exemption scheme
        Given I open the url "/"
        When I click on the link "Create new record"
        And I set "John" to the inputfield "#firstName"
        And I set "Smith" to the inputfield "#lastName"
        And I set "LS20 8DA" to the inputfield "#postcode"
        And I set "12" to the inputfield "#houseNumber"
        And I click on the element "button=Find address"
        And I click on the element "button=Confirm address"
        And I select the radio option with the value "XL Bully" from the radio group "breed"
        And I set "Fido" to the inputfield "#name"
        And I select the radio option with the value "interim-exemption" from the radio group "applicationType"
        And I set "01" to the inputfield "#interimExemption-day"
        And I set "02" to the inputfield "#interimExemption-month"
        And I set "2024" to the inputfield "#interimExemption-year"
        And I click on the element "button=Add dog details"
        Then I expect that element "h1" contains the text "Confirm dog details"
        And I expect that element "(//dd)[1]" contains the text "XL Bully"
        And I expect that element "(//dd)[2]" contains the text "Fido"
        And I expect that element "(//dd)[3]" contains the text "01 February 2024"

    Scenario: Confirm dog details
        And I click on the element "button=Confirm details"
        Then I expect that element "h1" contains the text "Enter police and court details"

    Scenario: Confirm all details
        And I set "John" to the inputfield "#legislationOfficer"
        And I click on the element "button=Continue"
        Then I expect that element "h1" contains the text "Confirm all details" 
        And I expect that element "(//dd)[1]" contains the text "John Smith"
        And I expect that element "(//dd)[3]" not contains any text
        And I expect that element "(//dd)[5]" contains the text "LS20 8DA"
        And I expect that element "(//dd)[7]" contains the text "West Yorkshire Police"
        And I expect that element "(//dd)[8]" contains the text "John"
        And I expect that element "(//dd)[9]" not contains any text
        And I expect that element "(//dd)[10]" contains the text "XL Bully"
        And I expect that element "(//dd)[11]" contains the text "Fido"
        And I expect that element "(//dd)[12]" contains the text "01 February 2024"              

    Scenario: Interim exemption scheme record created successfully
        And I click on the element "button=Confirm details"
        Then I expect that element "h1" contains the text "Record created" 
        And I expect that element "(//dd)[1]" contains the text "XL Bully"
        And I expect that element "(//dd)[2]" contains the text "Fido"
        And I expect that element "(//dd)[3]" contains the text "01 February 2024"
        And I expect that element "(//dd)[4]" contains the text "John Smith"
        And I expect that element "(//dd)[5]" contains the text "LS20 8DA"
        And I expect that element "(//dd)[6]" contains the text "West Yorkshire Police"
        And I expect that element "(//dd)[7]" contains the text "John"