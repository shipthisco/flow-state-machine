import { StrictMode, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StatesCanvas from './StatesCanvas'

const SAMPLE_WORKFLOW = {
  workflow_id: "job_status",
  title: "Job Status",
  start_state_id: "open",
  enable_direct_mode: false,
  enable_color_code: false,
  states: [
    {
      enable_workflow_update: false,
      workflow_updates: [],
      state_id: "open",
      title: "Opened",
      actions: [
        {
          title: "Get Customer Approval",
          next_state_id: "waiting_for_customer_approval",
          enable_role_criterion: false,
          roles_criterion: [],
          enable_field_criterion: true,
          field_criterion: [
            {
              conditions: [
                {
                  key: "shipment_type",
                  type: "drop_down",
                  filter: [],
                  value: [
                    "import"
                  ],
                  criteria: "is",
                  end_value: null
                }
              ]
            }
          ],
          enable_events: true,
          events: [
            {
              event_type: "email",
              enable_workflow_update: false,
              enable_role_criterion: false,
              enable_field_criterion: false,
              field_criterion: [
                {
                  conditions: [
                    {
                      key: "shipment_type",
                      type: "drop_down",
                      criteria: "is",
                      value: [
                        "export"
                      ],
                      end_value: null
                    }
                  ]
                }
              ],
              email_update_event: {
                body: "##customer_name.primary_contact_person.name##,<div><br></div><div><p style=\"margin-bottom: 10px !important; box-sizing: border-box; margin-top: 0px; margin-right: 0px; margin-left: 0px; color: rgb(65, 65, 65); font-family: sans-serif;\">##job_id## is awaiting your approval.&nbsp;</p><p style=\"margin-bottom: 10px !important; box-sizing: border-box; margin-top: 0px; margin-right: 0px; margin-left: 0px; color: rgb(65, 65, 65); font-family: sans-serif;\"><br>{%erp_link%}/shipments/multi/sea_shipment/edit/__id__<br><br></p><p style=\"margin-bottom: 10px !important; box-sizing: border-box; margin-top: 0px; margin-right: 0px; margin-left: 0px; color: rgb(65, 65, 65); font-family: sans-serif;\">HBL NO: ##hbl_no##</p><p style=\"margin-bottom: 10px !important; box-sizing: border-box; margin-top: 0px; margin-right: 0px; margin-left: 0px; color: rgb(65, 65, 65); font-family: sans-serif;\">MBL NO: ##mbl_no##</p><p style=\"box-sizing: border-box; margin-top: 0px; margin-right: 0px; margin-left: 0px; margin-bottom: 10px !important; font-family: sans-serif; color: rgb(65, 65, 65);\">Details:<span style=\"background-color: transparent; box-sizing: border-box; font-weight: 700;\"><br></span></p><p style=\"box-sizing: border-box; margin-top: 0px; margin-right: 0px; margin-left: 0px; margin-bottom: 10px !important;\"><font color=\"#414141\" face=\"sans-serif\">PO#: ##order_ref_no##<br></font><span style=\"background-color: transparent; color: rgb(65, 65, 65); font-family: sans-serif;\">Consignee: ##consignee_name.company.name##<br></span><span style=\"background-color: transparent; color: rgb(65, 65, 65); font-family: sans-serif;\">Shipper: ##shipper_name.company.name##<br></span><span style=\"background-color: transparent; color: rgb(65, 65, 65); font-family: sans-serif;\">Delivery: ##delivery.company.name##</span></p><p style=\"box-sizing: border-box; margin-top: 0px; margin-right: 0px; margin-left: 0px; margin-bottom: 10px !important;\"><span style=\"color: rgb(65, 65, 65); font-family: sans-serif; background-color: transparent;\">Place of Pickup: <b>##place_of_pickup.location.description##</b> ; Pickup Date: <b>##place_of_pickup.pickup_date##</b><br></span><span style=\"background-color: transparent; color: rgb(65, 65, 65); font-family: sans-serif;\">Place of Receipt: <b>##place_of_receipt.location.description##</b> ; Ready Date: <b>##place_of_receipt.arrival_date##</b><br></span><span style=\"background-color: transparent; color: rgb(65, 65, 65); font-family: sans-serif;\">Port of Loading : <b>##port_of_loading.port.name##</b> ; ETD : <b>##port_of_loading.departure_date##</b><br></span><span style=\"background-color: transparent; color: rgb(65, 65, 65); font-family: sans-serif;\">Port of Discharge :<b> ##port_of_discharge.port.name##</b> ; ETA : <b>##port_of_discharge.arrival_date##</b><br></span><span style=\"background-color: transparent; color: rgb(65, 65, 65); font-family: sans-serif;\">Port of Destination : <b>##port_of_destination.port.name##</b> ; ETA : <b>##port_of_destination.arrival_date##&nbsp;</b></span><br></p><p style=\"margin-bottom: 10px !important; box-sizing: border-box; margin-top: 0px; margin-right: 0px; margin-left: 0px; color: rgb(65, 65, 65); font-family: sans-serif;\"><span style=\"background-color: transparent; box-sizing: border-box; font-weight: 700;\"><span style=\"font-weight: 400; background-color: transparent;\">Load Details:</span><span style=\"font-weight: 400; background-color: transparent;\">&nbsp;</span></span></p><p style=\"margin-bottom: 10px !important; box-sizing: border-box; margin-top: 0px; margin-right: 0px; margin-left: 0px; color: rgb(65, 65, 65); font-family: sans-serif;\"><span style=\"background-color: transparent; box-sizing: border-box; font-weight: 700;\"><span style=\"background-color: transparent; box-sizing: border-box;\">##load_str##</span><br></span></p></div><div>To accept the booking, please click on the following link.</div><div><br></div><div>{%action_link%}</div><div><br></div><div>{%employee_signature%}</div>",
                subject: "Approve Booking ##job_id## ##customer_name..company.name## ##quotation_reference..quotation_number##",
                self_cc_copy: false,
                self_bcc_copy: true,
                role_tos: [
                  {
                    _id: {
                      $oid: "67d4388b0fbffa87b524074a"
                    },
                    name: "test_role",
                    description: "Test Role",
                    _cls_: "employee_role",
                    __display: "Test Role"
                  },
                  {
                    _id: {
                      $oid: "6821a8135ec7b187702fc676"
                    },
                    name: "sales",
                    description: "Sales",
                    _cls_: "employee_role",
                    __display: "Sales"
                  },
                  {
                    _id: {
                      $oid: "66eda49320070ef79bd192fa"
                    },
                    name: "pricing_new",
                    description: "Pricing New",
                    _cls_: "employee_role",
                    __display: "Pricing New"
                  }
                ],
                static_tos: [],
                static_ccs: [],
                static_bccs: [],
                reference_tos: [
                  "~customer_name",
                  "additional_customer_access"
                ],
                reference_ccs: [],
                reference_bccs: [],
                enable_customer_link: false,
                enable_vendor_link: false,
                enable_action_link: true,
                action_link_meta: {
                  action_ids: [
                    "approve",
                    "cancel"
                  ],
                  action_report_name: "_action_sea_shipment_approval",
                  action_user_filter: "{\"shipment_id\":{\"type\":\"reference\",\"value\":\"##_id##\"}}",
                  as_user_type: "customer"
                },
                enable_pre_code: true,
                code: "let load_str = '';\nif (data.__cache.loads) {\n  if (data.__cache.loads.fcl_loads) {\n    for (let i = 0; i < data.__cache.loads.fcl_loads.length; i++) {\n      let load = data.__cache.loads.fcl_loads[i];\n      load_str += 'FCL Loads <br>';\n      load_str += load.description;\n      if (load.container_no) {\n        load_str += ', Container No: ' + load.container_no;\n      }\n      if (load.container_type && load.container_type.name) {\n        load_str += ', '+(load.container_count || 1)+ 'X ' + load.container_type.name;\n      }\n      if (load.packages_string) {\n        load_str += ', ' + load.packages_string;\n      }\n      load_str += '<br>';\n\n    }\n  }\n  if (data.__cache.loads.lcl_loads) {\n    for (let i = 0; i < data.__cache.loads.lcl_loads.length; i++) {\n      let load = data.__cache.loads.lcl_loads[i];\n      load_str += 'LCL Load ' + (i + 1) + ' <br>';\n      load_str += load.description + '&nbsp;';\n      if (load.package_type && load.package_type.name) {\n        load_str +=', '+ (load.package_quantity || 1)+ 'X ' + load.package_type.name;\n      }\n      if (load.gross_wt) {\n        load_str += ', Gross Weight: ' + load.gross_wt + ' ' + load.weight_unit;\n      }\n      if (load.cbm) {\n        load_str += ', Volume : ' + load.cbm + ' CBM';\n      }\n      load_str += '<br>';\n    }\n  }\n}\n\ndata['load_str'] = load_str;",
                is_ejs: true,
                static_from: {
                  email: "",
                  self_reply_to: false,
                  skip_sender_email: false
                },
                enable_static_file_attachment: false,
                report_attachments: [
                  "sea_booking_confirmation",
                  "document_hbl_report",
                  "document_mbl_report"
                ],
                file_attachments: [
                  {
                    files: [],
                    enable_field_criterion: false,
                    field_criterion: []
                  }
                ],
                attachment_accessors: [
                  "customer_documents"
                ],
                documents_multi_language: [],
                unselected_ccs: false,
                unselected_bccs: false,
                delay: 0
              },
              user_references: [],
              document_references: [],
              enable_flagged_condition: false,
              flags: [],
              only_user_type: [],
              enable_only_user_type: false,
              enable_advanced_criterion: true,
              enable_code_condition: false,
              enable_aggregate_data: false,
              enable_branch_criterion: false
            }
          ],
          is_primary_action: true,
          enable_confirmation: false,
          confirmation_message: "Why was this approval needed?",
          enable_email_confirmation: true,
          enable_tasks_update: false,
          tasks_to_complete: [],
          enable_update_fields: false,
          update_fields: [
            {
              attributes: {
                editable: true,
                viewable: true
              },
              field_meta: {
                field_width: {}
              },
              reference_meta: {},
              field_id: "hbl_no",
              label: "Hbl No",
              field_type: "single_line"
            }
          ],
          action_id: "get_customer_approval",
          enable_remark_field: true,
          enable_customer_action: false,
          enable_confirmation_reason: false,
          attachment_accessors: [
            "customer_documents"
          ],
          enable_workflow_update: false,
          workflow_updates: [
            {
              workflow_id: "shipment_status",
              document_view: "sea_shipment",
              document_id_accessor: "_id",
              to_state: "confirmed",
              enable_action: false,
              action_ids: []
            }
          ],
          task_updates: [],
          enable_code_check: false,
          check_code: "data",
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          external_action_meta: {
            handle_type: "patch",
            title: "tEST TITLE",
            url: "https://github.com/revolist/revogrid/issues/317",
            has_confirmation: false,
            expand_fields: [],
            required_fields: []
          },
          confirmation_choices: [
            {
              display: "Yes",
              value: "yes"
            },
            {
              display: "NO",
              value: "NO"
            }
          ],
          confirmation_choice_title: "Select one",
          confirmation_choice_validation: false,
          tasks_to_open: [],
          enable_data_patch: false,
          data_patch: "",
          enable_required_fields: true,
          required_fields: [
            "shipping_line"
          ]
        },
        {
          title: "Mark Approved",
          next_state_id: "approved",
          enable_role_criterion: false,
          enable_field_criterion: true,
          field_criterion: [
            {
              conditions: [
                {
                  key: "shipment_type",
                  type: "drop_down",
                  filter: [],
                  criteria: "is",
                  value: [
                    "export"
                  ],
                  end_value: null
                }
              ]
            }
          ],
          enable_events: false,
          is_primary_action: false,
          enable_confirmation: true,
          enable_tasks_update: true,
          tasks_to_complete: [
            "booking_confirmation"
          ],
          enable_update_fields: false,
          action_id: "mark_approved",
          enable_remark_field: false,
          enable_customer_action: true,
          enable_confirmation_reason: false,
          attachment_accessors: [],
          enable_workflow_update: true,
          workflow_updates: [
            {
              workflow_id: "shipment_status",
              document_view: "sea_shipment",
              document_id_accessor: "_id",
              to_state: "confirmed",
              enable_action: false,
              action_ids: []
            }
          ],
          task_updates: [],
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          confirmation_choices: [],
          confirmation_choice_validation: false,
          tasks_to_open: [],
          enable_data_patch: false,
          enable_required_fields: false
        },
        {
          title: "Operational Execution Completed Successfully",
          next_state_id: "ops_complete",
          enable_role_criterion: false,
          roles_criterion: [
            {
              _id: {
                $oid: "5ab390ea3a90d41b2a1fe8a0"
              },
              name: "operations_head",
              description: "Operations head",
              _cls_: "employee_role",
              __display: "Operations head"
            },
            {
              _id: {
                $oid: "5ab390ea3a90d41b2a1fe8a1"
              },
              name: "sales",
              description: "Sales",
              _cls_: "employee_role",
              __display: "Sales"
            }
          ],
          enable_field_criterion: false,
          field_criterion: [
            {
              conditions: []
            }
          ],
          enable_events: true,
          events: [
            {
              event_type: "email",
              enable_workflow_update: false,
              field_criterion: [],
              email_update_event: {
                body: "Hello team,<br><br>Shipment class: ##shipment_class##<br>Movement type: ##movement_type##<div>HBL: ##hbl_no##<br><br><br>regards,<br>{%today%}<br>Syed</div>",
                subject: "Testing an email - Shipment is now under ops Complete",
                static_tos: [],
                reference_tos: [
                  "sales_executive"
                ],
                enable_customer_link: false,
                enable_vendor_link: false,
                enable_action_link: false,
                enable_pre_code: false,
                is_ejs: false,
                static_from: {
                  name: "Syed",
                  email: "syed@shipthis.co",
                  self_reply_to: true,
                  skip_sender_email: false
                },
                enable_static_file_attachment: false,
                report_attachments: [],
                file_attachments: [],
                attachment_accessors: [],
                documents_multi_language: [],
                delay: 0
              },
              user_references: [],
              document_references: [],
              flags: [],
              enable_advanced_criterion: false,
              enable_aggregate_data: false
            }
          ],
          is_primary_action: false,
          enable_confirmation: false,
          confirmation_message: "TEST MESSAGE",
          enable_email_confirmation: true,
          enable_tasks_update: true,
          tasks_to_complete: [],
          enable_update_fields: false,
          action_id: "ops_complete",
          enable_remark_field: false,
          enable_customer_action: false,
          enable_confirmation_reason: false,
          enable_workflow_update: false,
          workflow_updates: [
            {
              enable_action: false,
              action_ids: []
            }
          ],
          task_updates: [],
          enable_code_check: true,
          check_code: "if (data && data.shipment_class === \"master\") {\n    if (data.__cache &&\n        data.__cache.house_shipments &&\n        data.__cache.house_shipments.shipment_stats) {\n\n        var shipment_stats = data.__cache.house_shipments.shipment_stats;\n        var job_statuses   = [\"closed\", \"ops_complete\"];\n\n        if (shipment_stats.length > 0) {\n            result = true;\n            for (var i = 0; i < shipment_stats.length; i++) {\n                if (job_statuses.indexOf(shipment_stats[i].job_status) === -1) {\n                    result = false;\n                    break;\n                }\n            }\n        }\n    }\n}",
          error_message: "",
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          confirmation_choices: [],
          confirmation_choice_validation: false,
          tasks_to_open: [],
          enable_data_patch: false,
          data_patch: "",
          enable_required_fields: false
        },
        {
          title: "Cancel Shipment",
          next_state_id: "cancelled",
          enable_role_criterion: false,
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
          is_primary_action: false,
          enable_confirmation: true,
          confirmation_message: "Are you sure you want to cancel this shipment?",
          enable_tasks_update: true,
          tasks_to_complete: [
            "__all"
          ],
          enable_update_fields: false,
          action_id: "cancelled",
          enable_remark_field: false,
          enable_customer_action: false,
          enable_confirmation_reason: true,
          attachment_accessors: [],
          enable_workflow_update: false,
          task_updates: [],
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          confirmation_choices: [],
          confirmation_choice_validation: false,
          tasks_to_open: [],
          enable_data_patch: false,
          enable_required_fields: false
        },
        {
          title: "Hold Shipment",
          next_state_id: "shipment_hold",
          enable_role_criterion: false,
          enable_field_criterion: false,
          enable_events: false,
          is_primary_action: false,
          enable_confirmation: false,
          enable_email_confirmation: false,
          enable_tasks_update: false,
          enable_update_fields: false,
          action_id: "cargo_hold",
          enable_remark_field: false,
          enable_customer_action: false,
          enable_workflow_update: false,
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          enable_data_patch: false,
          enable_required_fields: false
        },
        {
          title: "Under Examination",
          next_state_id: "under_examination",
          enable_role_criterion: false,
          enable_field_criterion: false,
          enable_events: false,
          is_primary_action: false,
          enable_confirmation: false,
          enable_tasks_update: false,
          enable_update_fields: false,
          action_id: "under_examination",
          enable_remark_field: false,
          enable_customer_action: false,
          enable_workflow_update: false,
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          enable_data_patch: false,
          enable_required_fields: false
        }
      ],
      enable_grouped_state: false,
      enable_dependency_state: false,
      include_in_timeline: false,
      events_tab_only: false,
      enable_required_fields: false,
      required_fields: [
        "customer_name",
        "delivery"
      ],
      is_alternate_state: false,
      enable_field_criterion: false
    },
    {
      enable_workflow_update: false,
      state_id: "approved",
      title: "Approved",
      actions: [
        {
          title: "Mark Ops Complete",
          next_state_id: "ops_complete",
          enable_role_criterion: false,
          roles_criterion: [],
          enable_field_criterion: false,
          field_criterion: [
            {
              conditions: [
                {
                  key: "shipment_type",
                  type: "drop_down",
                  filter: [],
                  value: [
                    "export"
                  ],
                  criteria: "is",
                  end_value: null
                }
              ]
            }
          ],
          enable_events: false,
          is_primary_action: true,
          enable_confirmation: false,
          enable_tasks_update: false,
          tasks_to_complete: [],
          enable_update_fields: false,
          action_id: "ops_complete",
          enable_remark_field: false,
          enable_customer_action: false,
          enable_workflow_update: false,
          task_updates: [],
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          tasks_to_open: [],
          enable_data_patch: false,
          enable_required_fields: true,
          required_fields: [
            "booking_no",
            "order_ref_no"
          ]
        },
        {
          title: "Change to Open",
          next_state_id: "open",
          enable_role_criterion: false,
          roles_criterion: [
            {
              _id: {
                $oid: "5ab390eb3a90d41b2a1fe8a7"
              },
              _cls_: "employee_role",
              name: "account_head",
              description: "Account head",
              __display: "Account head"
            }
          ],
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
          is_primary_action: false,
          enable_confirmation: false,
          confirmation_message: "",
          enable_tasks_update: false,
          enable_update_fields: false,
          action_id: "change_to_open",
          enable_remark_field: false,
          enable_customer_action: false,
          enable_confirmation_reason: false,
          attachment_accessors: [],
          enable_workflow_update: false,
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          confirmation_choices: [],
          confirmation_choice_validation: false,
          enable_data_patch: false,
          enable_required_fields: false
        }
      ],
      enable_grouped_state: false,
      enable_dependency_state: false,
      include_in_timeline: false,
      events_tab_only: false,
      enable_required_fields: false,
      required_fields: [],
      is_alternate_state: false,
      enable_field_criterion: false,
      field_criterion: [
        {
          conditions: [
            {
              key: "shipment_type",
              type: "drop_down",
              filter: [],
              criteria: "is",
              value: [
                "export"
              ],
              end_value: null
            }
          ]
        }
      ]
    },
    {
      enable_workflow_update: false,
      state_id: "cancelled",
      title: "Cancelled",
      actions: [
        {
          title: "Change to Open",
          next_state_id: "open",
          enable_role_criterion: false,
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
          is_primary_action: false,
          enable_confirmation: false,
          enable_tasks_update: false,
          enable_update_fields: false,
          action_id: "change_to_open",
          enable_remark_field: false,
          enable_customer_action: false,
          enable_workflow_update: false,
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          enable_data_patch: false,
          enable_required_fields: false
        }
      ],
      enable_grouped_state: false,
      enable_dependency_state: false,
      include_in_timeline: false,
      events_tab_only: false,
      enable_required_fields: false,
      is_alternate_state: false,
      enable_field_criterion: false
    },
    {
      enable_workflow_update: false,
      state_id: "waiting_for_customer_approval",
      title: "Waiting For Approval",
      actions: [
        {
          title: "Mark Approved",
          next_state_id: "approved",
          enable_role_criterion: false,
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
          is_primary_action: true,
          enable_confirmation: false,
          enable_tasks_update: false,
          enable_update_fields: false,
          action_id: "mark_approved",
          enable_remark_field: false,
          enable_customer_action: false,
          attachment_accessors: [],
          enable_workflow_update: false,
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          enable_data_patch: false,
          enable_required_fields: false
        },
        {
          title: "Cancelled",
          next_state_id: "cancelled",
          enable_role_criterion: false,
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
          is_primary_action: false,
          enable_confirmation: false,
          enable_tasks_update: false,
          enable_update_fields: false,
          action_id: "cancelled",
          enable_remark_field: false,
          enable_customer_action: false
        }
      ],
      enable_grouped_state: false,
      enable_dependency_state: false,
      include_in_timeline: false,
      events_tab_only: false,
      enable_required_fields: false,
      required_fields: [],
      is_alternate_state: false,
      enable_field_criterion: false,
      field_criterion: [
        {
          conditions: []
        }
      ]
    },
    {
      enable_workflow_update: false,
      workflow_updates: [],
      state_id: "ops_complete",
      title: "Ops Complete",
      actions: [
        {
          title: "Close Job",
          next_state_id: "closed",
          enable_role_criterion: true,
          roles_criterion: [
            {
              _id: {
                $oid: "5ab390eb3a90d41b2a1fe8a7"
              },
              _cls_: "employee_role",
              name: "account_head",
              description: "Account head",
              __display: "Account head"
            },
            {
              _id: {
                $oid: "5ab390eb3a90d41b2a1fe8a8"
              },
              name: "account_receivable",
              description: "Account Receivable",
              _cls_: "employee_role",
              __display: "Account Receivable"
            }
          ],
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
          is_primary_action: true,
          enable_confirmation: false,
          enable_tasks_update: false,
          enable_update_fields: false,
          enable_remark_field: false,
          enable_customer_action: false,
          enable_workflow_update: false,
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          enable_data_patch: false
        },
        {
          title: "Open",
          next_state_id: "open",
          enable_role_criterion: false,
          enable_field_criterion: false,
          enable_events: false,
          is_primary_action: false,
          enable_confirmation: false,
          enable_tasks_update: false,
          enable_update_fields: false,
          action_id: "change_to_open",
          enable_remark_field: false,
          enable_customer_action: false,
          enable_workflow_update: false,
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          enable_data_patch: false
        }
      ],
      enable_grouped_state: false,
      enable_dependency_state: false,
      include_in_timeline: false,
      events_tab_only: false,
      enable_required_fields: false,
      is_alternate_state: false,
      enable_field_criterion: false
    },
    {
      enable_workflow_update: false,
      state_id: "closed",
      title: "Closed",
      actions: [
        {
          title: "Change to Ops Complete",
          next_state_id: "ops_complete",
          enable_role_criterion: true,
          roles_criterion: [
            {
              _id: {
                $oid: "5ab390eb3a90d41b2a1fe8a7"
              },
              _cls_: "employee_role",
              name: "account_head",
              description: "Account head",
              __display: "Account head"
            },
            {
              _id: {
                $oid: "5ab390eb3a90d41b2a1fe8a8"
              },
              name: "account_receivable",
              description: "Account Receivable",
              _cls_: "employee_role",
              __display: "Account Receivable"
            }
          ],
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
          is_primary_action: false,
          enable_confirmation: false,
          enable_tasks_update: false,
          enable_update_fields: false,
          enable_remark_field: false,
          enable_customer_action: false,
          enable_workflow_update: false,
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          enable_data_patch: false,
          enable_required_fields: false
        }
      ],
      enable_grouped_state: false,
      enable_dependency_state: false,
      include_in_timeline: false,
      events_tab_only: false,
      enable_required_fields: false,
      is_alternate_state: false,
      enable_field_criterion: false
    },
    {
      enable_workflow_update: false,
      state_id: "shipment_hold",
      title: "Shipment Hold",
      actions: [
        {
          title: "Back to open",
          next_state_id: "open",
          enable_role_criterion: false,
          enable_field_criterion: false,
          enable_events: false,
          is_primary_action: false,
          enable_confirmation: false,
          enable_tasks_update: false,
          enable_update_fields: false,
          enable_customer_action: false,
          enable_workflow_update: false,
          enable_code_check: false,
          enable_all_task_completed_check: false,
          enable_show_action_on_failed_condition: false,
          is_external_action: false,
          enable_data_patch: false,
          enable_required_fields: false
        }
      ],
      enable_grouped_state: false,
      enable_dependency_state: false,
      include_in_timeline: false,
      events_tab_only: false,
      enable_required_fields: false,
      is_alternate_state: false,
      enable_field_criterion: false
    },
    {
      enable_workflow_update: false,
      state_id: "under_examination",
      title: "Under Examination",
      enable_grouped_state: false,
      enable_dependency_state: false,
      include_in_timeline: false,
      events_tab_only: false,
      enable_required_fields: false,
      is_alternate_state: false,
      enable_field_criterion: false
    },
    {
      enable_workflow_update: false,
      state_id: "voided",
      title: "Void",
      enable_grouped_state: false,
      enable_dependency_state: false,
      include_in_timeline: false,
      events_tab_only: false,
      enable_required_fields: false,
      enable_field_criterion: false
    }
  ],
  enable_linked_email_notification: false,
  use_session: false
}

function parseCurl(curlStr) {
  const config = {}
  const str = curlStr.replace(/\\\n/g, ' ').trim()

  const urlMatch = str.match(/curl\s+(?:--[a-z-]+\s+)*['"]?(https?:\/\/[^\s'"]+)['"]?/) ||
                   str.match(/['"]?(https?:\/\/[^\s'"]+)['"]?/)
  if (urlMatch) {
    try {
      const url = new URL(urlMatch[1])
      config.apiEndpoint = `${url.protocol}//${url.host}/`
    } catch {}
  }

  const headerRegex = /-H\s+['"]([^'"]+)['"]/gi
  let match
  while ((match = headerRegex.exec(str)) !== null) {
    const headerLine = match[1]
    const colonIdx = headerLine.indexOf(':')
    if (colonIdx === -1) continue
    const key = headerLine.slice(0, colonIdx).trim().toLowerCase()
    const val = headerLine.slice(colonIdx + 1).trim()

    if (key === 'authtoken' || key === 'authorization') {
      config.authToken = val
    } else if (key === 'organisation') {
      config.organisation = val
    } else if (key === 'location') {
      config.location = val
    } else if (key === 'region') {
      config.region = val
    } else if (key === 'usertype') {
      config.usertype = val
    }
  }

  return config
}

const CONFIG_FIELDS = [
  { key: 'apiEndpoint', label: 'API Endpoint', placeholder: 'https://api.shipthis.co/' },
  { key: 'authToken', label: 'Auth Token', placeholder: 'Bearer ...' },
  { key: 'organisation', label: 'Organisation', placeholder: 'org_id' },
  { key: 'location', label: 'Location', placeholder: 'location_id' },
  { key: 'region', label: 'Region', placeholder: 'region' },
  { key: 'usertype', label: 'User Type', placeholder: 'usertype' },
]

const ALL_KEYS = CONFIG_FIELDS.map((f) => f.key)

function DevWrapper() {
  const [workflow, setWorkflow] = useState(SAMPLE_WORKFLOW)
  const [showConfig, setShowConfig] = useState(false)
  const [curlInput, setCurlInput] = useState('')
  const [showCurlInput, setShowCurlInput] = useState(false)
  const [apiConfig, setApiConfig] = useState(() => {
    const cfg = {}
    ALL_KEYS.forEach((k) => { cfg[k] = localStorage.getItem(`wsc_${k}`) || '' })
    return cfg
  })

  const handleChange = useCallback((updated) => {
    setWorkflow(updated)
  }, [])

  const updateField = (key, value) => {
    setApiConfig((prev) => ({ ...prev, [key]: value }))
    localStorage.setItem(`wsc_${key}`, value)
  }

  const handleCurlPaste = () => {
    if (!curlInput.trim()) return
    const parsed = parseCurl(curlInput)
    const newConfig = { ...apiConfig }
    Object.entries(parsed).forEach(([k, v]) => {
      if (v) {
        newConfig[k] = v
        localStorage.setItem(`wsc_${k}`, v)
      }
    })
    setApiConfig(newConfig)
    setCurlInput('')
    setShowCurlInput(false)
  }

  const handleClear = () => {
    ALL_KEYS.forEach((k) => localStorage.removeItem(`wsc_${k}`))
    const empty = {}
    ALL_KEYS.forEach((k) => { empty[k] = '' })
    setApiConfig(empty)
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 min-h-0">
        <StatesCanvas
          workflow={workflow}
          onChange={handleChange}
          apiConfig={apiConfig}
        />
      </div>

      {/* Floating API config button */}
      <button
        onClick={() => setShowConfig((v) => !v)}
        className="fixed bottom-4 right-4 z-[200] bg-foreground text-background rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity text-xs font-bold cursor-pointer"
        title="API Configuration"
      >
        API
      </button>

      {showConfig && (
        <div className="fixed bottom-16 right-4 z-[200] bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 space-y-3 max-h-[80vh] overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-800">API Configuration</h3>
          <p className="text-[10px] text-gray-500">
            Enter credentials to enable live API calls. Values persisted in localStorage.
          </p>

          {/* Curl paste section */}
          <div className="space-y-1">
            <button
              onClick={() => setShowCurlInput((v) => !v)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              {showCurlInput ? 'Hide' : 'Paste cURL'}
            </button>
            {showCurlInput && (
              <div className="space-y-2">
                <textarea
                  value={curlInput}
                  onChange={(e) => setCurlInput(e.target.value)}
                  placeholder={"Paste a cURL command here...\ne.g. curl 'https://api.shipthis.co/...' -H 'authtoken: ...' -H 'organisation: ...'"}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-ring font-mono h-24 resize-y"
                />
                <button
                  onClick={handleCurlPaste}
                  className="w-full text-xs px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md cursor-pointer"
                >
                  Extract from cURL
                </button>
              </div>
            )}
          </div>

          {CONFIG_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-medium text-gray-600">{label}</label>
              <input
                type={key === 'authToken' ? 'password' : 'text'}
                value={apiConfig[key]}
                onChange={(e) => updateField(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfig(false)}
              className="flex-1 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleClear}
              className="text-xs px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DevWrapper />
  </StrictMode>
)

