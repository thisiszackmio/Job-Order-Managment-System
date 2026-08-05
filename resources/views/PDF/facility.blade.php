<!DOCTYPE html>
<html>
  <head>
    <style>
      html, body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 10px 25px; }
      .title-area { text-align: right; font-size: 10px; }
      .title-area .insp-no { font-size: 10px; border-bottom: 1px solid #000; padding: 0px 15px; font-weight: bold; }
      .logo img { width: 78%; }
      .header-table { margin-top: 10px;}
      .header-table td { border: 1px solid; text-align: center; }
      .header-table td:nth-child(2) { border-left: 0; border-right: 0; }
      .header-table td:nth-child(3) { text-align: left; }
      td.header-title { padding: 15px 0px; }
      .form-name { font-size: 19px; margin: 0; margin-bottom: 6px; font-weight: bold; }
      .form-location { font-size: 15px; margin: 0; }
      .form-num { font-size: 12px; font-weight: bold; padding: 10px; border-bottom: 1px solid #000; }
      /* .iso-cert { border-bottom: 1px solid #000; } */
      .rev-no { font-size: 12px; padding: 10px; font-weight: bold; }
      .border { border: 1px solid #000; border-top: 0; padding: 8px; }
      .bordered { border: 1px solid #000; padding: 8px; }
      .borders { border: 1px solid #000; border-top: 0; height: 5px; }
    </style>
  </head>

  @php
    $logo = public_path('images/ppa_logo.png');
    $type = pathinfo($logo, PATHINFO_EXTENSION);
    $data = file_get_contents($logo);
    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
  @endphp

  @php
    $startDate = \Carbon\Carbon::parse($facility->date_start);
    $endDate = \Carbon\Carbon::parse($facility->date_end);
    $startTime = \Carbon\Carbon::parse($facility->time_start);
    $endTime = \Carbon\Carbon::parse($facility->time_end);
  @endphp

  @php
    function encodeSignature($fileName) {
        if (!$fileName) return null;

        $fullPath = storage_path('app/public/displayesig/' . $fileName);

        if (!file_exists($fullPath)) {
            return null;
        }

        $type = pathinfo($fullPath, PATHINFO_EXTENSION);
        $data = file_get_contents($fullPath);

        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }

    $requestorSign = encodeSignature($requestor->esign ?? null);
    $adminSign = encodeSignature($admin->esign ?? null);
  @endphp

  <body>
    {{-- Control Number --}}
    <div class="title-area">
      <span>Control No:</span>
      <span class="insp-no">{{ $facility->id }}</span>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      {{-- Form Title --}}
      <tr>
        <td width="100%">
          <table class="header-table" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="logo" width="13%">
                <img src="{{ $base64; }}" alt="My Image" />
              </td>
              <td class="header-title" width="60%">
                <p class="form-name">REQUEST FOR THE USE OF FACILITY / VENUE</p>
              </td>
              <td class="iso-cert">
                <div class="form-num">RF 03-2018 ver 1</div>
                <div class="rev-no">DATE: {{ $facility->created_at->format('F d, Y') }}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td class="borders"></td></tr>
      {{-- Main Form --}}
      <tr>
        <td class="border" width="100%">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td colspan="4" height="5"></td></tr>
            <tr>
              <td colspan="4" height="5" style="padding-right: 5rem;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="30%" style="font-size:13px;">Request Office/Division:</td>
                    <td width="50%" style="border-bottom:1px solid #000; padding-left: 5px; font-size:13px;">
                      {{ $facility->request_office }}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="4" height="5" style="padding-right: 5rem;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="30%" style="font-size:13px; padding-top: 5px;">Title/Purpose of Activity:</td>
                    <td width="50%" style="border-bottom:1px solid #000; padding-top: 5px; padding-left: 5px; font-size:13px;">
                      {{ $facility->title_of_activity }}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="4" height="5" style="padding-right: 5rem;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="30%" style="font-size:13px; padding-top: 5px;">Date of Activity:</td>
                    <td width="50%" style="border-bottom:1px solid #000; padding-top: 5px; padding-left: 5px; font-size:13px;">
                      {{ $startDate->isSameDay($endDate) 
                        ? $startDate->format('F d, Y') 
                        : $startDate->format('F d, Y') . ' to ' . $endDate->format('F d, Y') 
                      }}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="4" height="5" style="padding-right: 5rem;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="30%" style="font-size:13px; padding-top: 5px;">Time of Activity (START and END):</td>
                    <td width="50%" style="border-bottom:1px solid #000; padding-top: 5px; padding-left: 5px; font-size:13px;">
                      {{ $startDate->isSameDay($endDate) 
                        ? strtolower($startTime->format('h:i A')) . ' to ' . strtolower($endTime->format('h:i A'))
                        : $startDate->format('F d, Y') .' '. strtolower($startTime->format('h:i A')) . ' to ' . $endDate->format('F d, Y') .' '. strtolower($endTime->format('h:i A')) 
                      }}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="4" width="30%" style="font-size:13px; padding-top: 5px;">Facility/ies Venue being Requested:</td>
            </tr>
            <tr>
              <td style="padding-top: 12px;" width="30%" > 
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="7%" style="border:1px solid #000; text-align:center; font-size:13px; width: 15px;">
                      {{ $facility->mph == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight: bold;">
                      Multi-Purpose Hall (MPH) 
                    </td>
                  </tr>
                </table>
              </td>
              <td style="padding-top: 12px" width="25%" >
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="7%" style="border:1px solid #000; text-align:center; font-size:13px; width: 15px;">
                      {{ $facility->conference == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight: bold;">
                      Conference Room 
                    </td>
                  </tr>
                </table>
              </td>
              <td style="padding-top: 12px" width="20%" >
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="7%" style="border:1px solid #000; text-align:center; font-size:13px; width: 15px;">
                      {{ $facility->dorm == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight: bold;">
                      Dormitory
                    </td>
                  </tr>
                </table>
              </td>
              <td style="padding-top: 12px" width="25%" >
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="7%" style="border:1px solid #000; text-align:center; font-size:13px; width: 15px;">
                      {{ $facility->other == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight: bold;">
                      Others
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr><td colspan="4" height="10"></td></tr>
          </table>
        </td>
      </tr>
      <tr><td height="5"></td></tr>
      {{-- Facility --}}
      <tr>
        <td class="bordered">
          <table width="100%" cellpadding="0" cellspacing="0">
            {{-- TITLE --}}
            <tr>
              <td colspan="2" style="font-size:13px; font-weight:bold;">
                * For the Multi-Purpose Hall / Conference Room / Others:
              </td>
            </tr>
            {{-- TWO COLUMNS --}}
            <tr>
              {{-- LEFT --}}
              <td width="50%" valign="top" style="padding-top:15px; padding-left:6rem;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->table == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight:bold;">
                      Tables (No:
                      <span style="
                        display:inline-block;
                        border-bottom:1px solid #000;
                        min-width:50px;
                        text-align:center;
                      ">
                        {{ $facility->no_table ?? '' }}
                      </span>
                      )
                    </td>
                  </tr>
                  <tr><td height="5"></td></tr>
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->chair == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight:bold;">
                      Chair (No:
                      <span style="
                        display:inline-block;
                        border-bottom:1px solid #000;
                        min-width:50px;
                        text-align:center;
                      ">
                        {{ $facility->no_chair ?? '' }}
                      </span>
                      )
                    </td>
                  </tr>
                  <tr><td height="5"></td></tr>
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->projector == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight:bold;">
                      Projector
                    </td>
                  </tr>
                  <tr><td height="5"></td></tr>
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->projector_screen == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight:bold;">
                      Projector Screen
                    </td>
                  </tr>
                  <tr><td height="5"></td></tr>
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->document_camera == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight:bold;">
                      Document Camera
                    </td>
                  </tr>
                </table>
              </td>

              {{-- RIGHT --}}
              <td width="50%" valign="top" style="padding-top:15px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->laptop == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight:bold;">
                      Laptop
                    </td>
                  </tr>
                  <tr><td height="5"></td></tr>
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->television == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight:bold;">
                      Television
                    </td>
                  </tr>
                  <tr><td height="5"></td></tr>
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->sound_system == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight:bold;">
                      Sound System
                    </td>
                  </tr>
                  <tr><td height="5"></td></tr>
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->videoke == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight:bold;">
                      Videoke
                    </td>
                  </tr>
                  <tr><td height="5"></td></tr>
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->microphone == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px; font-weight:bold;">
                      Microphone (No:
                      <span style="
                        display:inline-block;
                        border-bottom:1px solid #000;
                        min-width:50px;
                        text-align:center;
                      ">
                        {{ $facility->no_microphone ?? '' }}
                      </span>
                      )
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            {{-- OTHERS (FULL WIDTH) --}}
            <tr>
              <td colspan="2" style="padding-top:10px; padding-left:6rem;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="7%" style="border-bottom:1px solid #000; text-align:center; font-size:13px; width:50px;">
                      {{ $facility->others == 1 ? 'X' : '' }}
                    </td>
                    <td width="93%" style="font-size:13px; padding-left:6px;">
                      <span style="font-weight:bold;">Others,</span>
                      <span style="font-weight:regular;">please specify</span>
                      <span style="
                        display:inline-block;
                        border-bottom:1px solid #000;
                        min-width:250px;
                        max-width:250px;
                        text-align:center;
                        font-weight:400;
                      ">
                        {{ $facility->specify ?? '' }}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr><td colspan="4" height="10"></td></tr>
          </table>
        </td>
      </tr>
      <tr><td height="5"></td></tr>
      {{-- Dormitory --}}
      <tr>
        <td class="bordered">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td colspan="2">
                {{-- Title --}}
                <div style="font-weight:bold; font-size: 13px; margin-bottom:10px;">
                  * For the Dormitory
                </div>
              </td>
            </tr>
             {{-- TWO COLUMNS --}}
            <tr>
              {{-- LEFT --}}
              <td width="50%" valign="top" style="padding-left: 3rem; padding-right: 1.5rem;">
                @php
                $maleGuests = $facility->name_male
                    ? array_values(array_filter(preg_split('/\r\n|\r|\n/', trim($facility->name_male))))
                    : [];

                $totalMRows = max(6, count($maleGuests));
                @endphp
                {{-- Male Count --}}
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr style="padding-top: 15px;">
                    <td width="40px" style="border-bottom:1px solid #000; text-align:center; font-size: 13px; font-weight:bold;">
                      {{ count($maleGuests) > 0 ? count($maleGuests) : '' }}
                    </td>
                    <td style="padding-left:10px; font-size: 13px;">
                      No. of Male Guests
                    </td>
                  </tr>
                  {{-- Label --}}
                  <tr>
                    <td colspan="2" style="font-size:13px; font-weight:bold; padding-top: 8px; padding-bottom: 5px;">
                      Name of Guests:
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      @for ($i = 0; $i < $totalMRows; $i++)
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:3px;">
                          <tr>
                            <td width="20px" style="font-size:12px; height: 20px;">
                              {{ $i + 1 }}.
                            </td>
                            <td style="border-bottom:1px solid #000; padding-left:5px; font-size:12px; height: 18px;">
                              {{ $maleGuests[$i] ?? '' }}
                            </td>
                          </tr>
                        </table>
                      @endfor
                    </td>
                  </tr>
                </table>
              </td>

              {{-- Right --}}
              <td width="50%" valign="top" style="padding-right: 3rem; padding-left: 1.5rem;">
                {{-- Female Count --}}
                @php
                  $femaleGuests = $facility->name_female
                      ? array_values(array_filter(preg_split('/\r\n|\r|\n/', trim($facility->name_female))))
                      : [];

                  $totalFRows = max(6, count($femaleGuests));
                  @endphp
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr style="padding-top: 15px;">
                    <td width="40px" style="border-bottom:1px solid #000; text-align:center; font-size: 13px; font-weight:bold;">
                      {{ count($femaleGuests) > 0 ? count($femaleGuests) : '' }}
                    </td>
                    <td style="padding-left:10px; font-size: 13px;">
                      No. of Female Guests
                    </td>
                  </tr>
                  {{-- Label --}}
                  <tr>
                    <td colspan="2" style="font-size:13px; font-weight:bold; padding-top: 8px; padding-bottom: 5px;">
                      Name of Guests:
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      @for ($i = 0; $i < $totalFRows; $i++)
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:3px;">
                          <tr>
                            <td width="20px" style="font-size:12px; height: 20px;">
                              {{ $i + 1 }}.
                            </td>
                            <td style="border-bottom:1px solid #000; padding-left:5px; font-size:12px; height: 18px;">
                              {{ $femaleGuests[$i] ?? '' }}
                            </td>
                          </tr>
                        </table>
                      @endfor
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-right: 3rem; padding-left: 3rem; padding-top: 1rem; padding-bottom: 1rem;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="13%" style=" font-size:13px;">
                      Other Details:
                    </td>
                    <td width="87%" style="font-size:13px; padding-left:6px;">
                      <span style="
                        display:inline-block;
                        border-bottom:1px solid #000;
                        text-align:left;
                        width: 100%;
                        font-weight:400;
                        padding-left: 5px;
                        height: 18px;
                      ">
                        {{ $facility->other_details ?? '' }}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td height="5"></td></tr>
      {{-- Esig Area --}}
      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" class="bordered">
                {{-- Title --}}
                <div style="font-size: 13px; margin-bottom:10px;">
                  Requested by:
                </div>

                <table width="70%" align="center">
                    <tr>
                      <td style="height:30px; text-align:center; vertical-align:bottom; position: relative;">
                        @if(!in_array($facility->admin_approval, [0, 4]))
                            <img src="{{ $requestorSign }}" width="70%" style="position: absolute; top: -13px; left: 35px;"><br>
                        @endif
                        <span style="font-size:14px; font-weight:bold;">
                            {{ $facility->user_name }}
                        </span>
                      </td>
                    </tr>
                </table>

              </td>
              <td width="50%" class="bordered">
                {{-- Title --}}
                <div style="font-size: 13px; margin-bottom:10px;">
                  @if(in_array($facility->admin_approval, [1,2,3]))
                    Approved by:
                  @elseif($facility->admin_approval == 4)
                    Disapproved by:
                  @else
                    Approved / Disapproved by:
                  @endif
                </div>

                <table width="70%" align="center">
                    <tr>
                      <td style="height:30px; text-align:center; vertical-align:bottom; position: relative;">
                        @if(!in_array($facility->admin_approval, [0, 4]))
                            <img src="{{ $adminSign }}" width="70%" style="position: absolute; top: -13px; left: 35px;"><br>
                        @endif
                        <span style="font-size:14px; font-weight:bold;">
                            {{ $admin->firstname . ' ' .($admin->middlename ? $admin->middlename . '. ' : '') . $admin->lastname}}
                        </span>
                      </td>
                    </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; text-align: center; font-size: 13px; padding: 5px;">
                {{ $requestor->position ?? '' }}
              </td>
              <td style="border: 1px solid #000; text-align: center; font-size: 13px; padding: 5px;">
                {{ $admin->position ?? '' }}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td height="5"></td></tr>
      {{-- OPR --}}
      <tr>
        <td valign="top">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>

              {{-- LEFT --}}
              <td width="50%" class="bordered" valign="top" style="vertical-align:top; text-align:left;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td colspan="2" valign="top" style="font-size:13px; font-weight:bold; text-align:left;">
                      Instruction for the OPR for Action
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" valign="top" style="font-size:13px; text-align:left;">
                      {{ $facility->obr_instruct }}
                    </td>
                  </tr>
                </table>
              </td>

              {{-- RIGHT --}}
              <td width="50%" class="bordered" valign="top" style="vertical-align:top; text-align:left;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td colspan="2" valign="top" style="font-size:13px; font-weight:bold; text-align:left;">
                      OPR Action (Comments / Concerns)
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" valign="top" style="font-size:13px; text-align:left;">
                      {{ $facility->obr_comment }}
                    </td>
                  </tr>
                </table>
              </td>

            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td width="100%" style="font-size: 11px; color: #808080; font-style: italic;">
          Job Order Management System - This is system-generated.
        </td>
      </tr> 
    </table>
  </body>

</html>